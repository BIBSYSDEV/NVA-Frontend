import React, { FC, useState, useEffect, ChangeEvent } from 'react';
import { SortableContainer, SortableElement, SortEnd } from 'react-sortable-hoc';
import {
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Button,
  Tooltip,
  TableContainer,
  Typography,
} from '@material-ui/core';
import { Field, FieldProps, FormikProps, useFormikContext, FieldArrayRenderProps, move } from 'formik';
import { useTranslation } from 'react-i18next';
import DeleteIcon from '@material-ui/icons/Delete';
import WarningIcon from '@material-ui/icons/Warning';
import CheckIcon from '@material-ui/icons/Check';
import AddIcon from '@material-ui/icons/Add';
import deepmerge from 'deepmerge';
import { ContributorFieldNames, SpecificContributorFieldNames } from '../../../../types/publicationFieldNames';
import { Contributor, emptyContributor } from '../../../../types/contributor.types';
import { Registration } from '../../../../types/registration.types';
import AddContributor from '../AddContributorModal';
import styled from 'styled-components';
import AffiliationsCell from './AffiliationsCell';
import ConfirmDialog from '../../../../components/ConfirmDialog';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../../../redux/actions/notificationActions';
import { NotificationVariant } from '../../../../types/notification.types';
import { Authority } from '../../../../types/authority.types';
import { overwriteArrayMerge } from '../../../../utils/formik-helpers';
import { BackendTypeNames } from '../../../../types/publication_types/commonRegistration.types';

const StyledWarningIcon = styled(WarningIcon)`
  color: ${({ theme }) => theme.palette.warning.main};
`;

const StyledCheckIcon = styled(CheckIcon)`
  color: ${({ theme }) => theme.palette.success.main};
`;

const StyledAddAuthorButton = styled(Button)`
  margin-top: 1rem;
`;

const StyledEmailTextField = styled(TextField)`
  margin-bottom: 0.5rem;
`;

interface UnverifiedContributor {
  name: string;
  index: number;
}

interface SortableItemProps {
  contributor: Contributor;
  onRemoveContributorClick: () => void;
  setUnverifiedContributor: (unverifiedContributor: UnverifiedContributor) => void;
}

const SortableItem = SortableElement(
  ({ contributor, onRemoveContributorClick, setUnverifiedContributor }: SortableItemProps) => {
    const { t } = useTranslation('registration');
    const index = contributor.sequence - 1;
    const baseFieldName = `${ContributorFieldNames.CONTRIBUTORS}[${index}]`;
    const { values, setFieldValue }: FormikProps<Registration> = useFormikContext();
    const [emailValue, setEmailValue] = useState(values.entityDescription.contributors[index]?.email ?? '');

    return (
      <TableRow tabIndex={0} key={contributor.identity.id}>
        <TableCell align="left">
          <Typography variant="h5">#{contributor.sequence}</Typography>
          <Typography variant="h5">
            {contributor.identity.name}{' '}
            {contributor.identity.arpId ? (
              <Tooltip title={t('contributors.known_author_identity') as string}>
                <StyledCheckIcon />
              </Tooltip>
            ) : (
              <Tooltip title={t('contributors.unknown_author_identity') as string}>
                <StyledWarningIcon />
              </Tooltip>
            )}
          </Typography>

          <Field name={`${baseFieldName}.${SpecificContributorFieldNames.CORRESPONDING}`}>
            {({ field }: FieldProps) => (
              <FormControlLabel
                data-testid="author-corresponding-checkbox"
                control={<Checkbox checked={!!field.value} {...field} />}
                label={t('contributors.corresponding')}
              />
            )}
          </Field>
          <div>
            {contributor.correspondingAuthor && (
              <Field name={`${baseFieldName}.${SpecificContributorFieldNames.EMAIL}`}>
                {({ field, meta: { error, touched } }: FieldProps) => (
                  <StyledEmailTextField
                    data-testid="author-email-input"
                    variant="outlined"
                    label={t('common:email')}
                    {...field}
                    onChange={(event: ChangeEvent<any>) => {
                      setEmailValue(event.target.value);
                    }}
                    onBlur={(event: ChangeEvent<any>) => {
                      setFieldValue(`${baseFieldName}.${SpecificContributorFieldNames.EMAIL}`, emailValue);
                      field.onBlur(event);
                    }}
                    value={emailValue}
                    error={touched && !!error}
                    helperText={touched && error}
                  />
                )}
              </Field>
            )}
          </div>

          {!contributor.identity.arpId && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              data-testid={`button-set-unverified-contributor-${contributor.identity.name}`}
              onClick={() =>
                setUnverifiedContributor({
                  name: contributor.identity.name,
                  index,
                })
              }>
              {t('contributors.connect_author_identity')}
            </Button>
          )}
        </TableCell>
        <TableCell align="left">
          {contributor.identity && (
            <AffiliationsCell affiliations={contributor.affiliations} baseFieldName={baseFieldName} />
          )}
        </TableCell>
        <TableCell align="right">
          <Button
            color="secondary"
            variant="contained"
            size="small"
            data-testid={`button-remove-contributor-${contributor.identity.name}`}
            onClick={onRemoveContributorClick}>
            <DeleteIcon />
            {t('contributors.remove_contributor')}
          </Button>
        </TableCell>
      </TableRow>
    );
  }
);

interface SortableListProps {
  contributors: Contributor[];
  onDelete: (index: number) => void;
  onSortEnd: ({ oldIndex, newIndex }: SortEnd) => void;
  setUnverifiedContributor: (unverifiedContributor: UnverifiedContributor) => void;
}

const SortableList = SortableContainer(({ contributors, onDelete, setUnverifiedContributor }: SortableListProps) => {
  const { t } = useTranslation('registration');
  const [contributorToRemove, setContributorToRemove] = useState<Contributor | null>(null);

  const closeConfirmDialog = () => {
    setContributorToRemove(null);
  };

  return (
    <TableContainer>
      <Table>
        <TableBody>
          {contributors.map((contributor: Contributor, index: number) => (
            <SortableItem
              index={index}
              contributor={contributor}
              key={contributor.identity.id || contributor.identity.name}
              onRemoveContributorClick={() => setContributorToRemove(contributor)}
              setUnverifiedContributor={setUnverifiedContributor}
            />
          ))}
        </TableBody>
      </Table>
      {contributorToRemove && (
        <ConfirmDialog
          open={!!contributorToRemove}
          title={t('contributors.confirm_remove_contributor_title')}
          onAccept={() => {
            onDelete(contributorToRemove.sequence - 1);
            closeConfirmDialog();
          }}
          onCancel={closeConfirmDialog}>
          <Typography>
            {t('contributors.confirm_remove_contributor_text', {
              contributorName: contributorToRemove.identity.name,
            })}
          </Typography>
        </ConfirmDialog>
      )}
    </TableContainer>
  );
});

interface SortableTableProps extends Pick<FieldArrayRenderProps, 'push' | 'remove' | 'replace'> {}

const SortableTable: FC<SortableTableProps> = ({ push, remove, replace }) => {
  const { t } = useTranslation('registration');
  const dispatch = useDispatch();
  const { values, setValues }: FormikProps<Registration> = useFormikContext();
  const {
    entityDescription: { contributors },
  } = values;
  const [openContributorModal, setOpenContributorModal] = useState(false);
  const [unverifiedContributor, setUnverifiedContributor] = useState<UnverifiedContributor | null>(null);
  const orderedContributors = [...contributors].map((contributor, index) => ({ ...contributor, sequence: index + 1 }));

  const toggleContributorModal = () => {
    if (unverifiedContributor) {
      setUnverifiedContributor(null);
    }
    setOpenContributorModal(!openContributorModal);
  };

  useEffect(() => {
    if (unverifiedContributor) {
      // Open modal if user has selected a unverified contributor
      setOpenContributorModal(true);
    }
  }, [unverifiedContributor]);

  const handleOnSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
    const reorderedContributors = move(orderedContributors, oldIndex, newIndex) as Contributor[];
    // Ensure incrementing sequence values
    const newContributors = reorderedContributors.map((contributor, index) => ({
      ...contributor,
      sequence: index + 1,
    }));
    setValues(
      deepmerge(values, { entityDescription: { contributors: newContributors } }, { arrayMerge: overwriteArrayMerge })
    );
  };

  const handleOnRemove = (indexToRemove: number) => {
    const remainingContributors = [...contributors]
      .filter((cont, index) => index !== indexToRemove)
      .map((contributor, index) => ({ ...contributor, sequence: index + 1 }));
    setValues(
      deepmerge(
        values,
        { entityDescription: { contributors: remainingContributors } },
        { arrayMerge: overwriteArrayMerge }
      )
    );
  };

  const onAuthorSelected = (authority: Authority) => {
    if (orderedContributors.some((contributor) => contributor.identity.arpId === authority.systemControlNumber)) {
      dispatch(setNotification(t('contributors.author_already_added'), NotificationVariant.Info));
      return;
    }

    const identity = {
      ...emptyContributor.identity,
      arpId: authority.systemControlNumber,
      orcId: authority.orcids.length > 0 ? authority.orcids[0] : '',
      name: authority.name,
    };

    if (!unverifiedContributor) {
      const newContributor: Contributor = {
        ...emptyContributor,
        identity,
        affiliations: authority.orgunitids.map((unitUri) => ({
          type: BackendTypeNames.ORGANIZATION,
          id: unitUri,
        })),
        sequence: orderedContributors.length + 1,
      };
      push(newContributor);
    } else {
      const verifiedContributor: Contributor = {
        ...orderedContributors[unverifiedContributor.index],
        identity,
      };
      replace(unverifiedContributor.index, verifiedContributor);
    }
  };

  return (
    <>
      <SortableList
        contributors={orderedContributors}
        onSortEnd={handleOnSortEnd}
        onDelete={handleOnRemove}
        distance={10}
        setUnverifiedContributor={setUnverifiedContributor}
      />
      <StyledAddAuthorButton
        onClick={toggleContributorModal}
        variant="contained"
        color="primary"
        data-testid="add-contributor">
        <AddIcon />
        {t('contributors.add_author')}
      </StyledAddAuthorButton>
      <AddContributor
        initialSearchTerm={unverifiedContributor?.name}
        open={openContributorModal}
        toggleModal={toggleContributorModal}
        onAuthorSelected={onAuthorSelected}
      />
    </>
  );
};

export default SortableTable;
