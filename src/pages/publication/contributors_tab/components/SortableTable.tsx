import React, { FC, useState, useEffect, useCallback } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
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
} from '@material-ui/core';
import { Field, FieldProps, FormikProps, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import DeleteIcon from '@material-ui/icons/Delete';
import WarningIcon from '@material-ui/icons/Warning';
import CheckIcon from '@material-ui/icons/Check';
import AddIcon from '@material-ui/icons/Add';

import { ContributorFieldNames, SpecificContributorFieldNames } from '../../../../types/publicationFieldNames';
import { Contributor, emptyContributor } from '../../../../types/contributor.types';
import { FormikPublication, BackendTypeNames } from '../../../../types/publication.types';
import SubHeading from '../../../../components/SubHeading';
import AddContributor from '../AddContributorModal';
import styled from 'styled-components';
import AffiliationsCell from './AffiliationsCell';
import ConfirmDialog from '../../../../components/ConfirmDialog';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../../../redux/actions/notificationActions';
import { NotificationVariant } from '../../../../types/notification.types';
import { Authority } from '../../../../types/authority.types';
import { getUnitUri } from '../../../../utils/unitUrl';

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

const StyledContainer = styled.div`
  overflow-x: auto;
  margin-right: auto;
  margin-left: auto;
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
    const { t } = useTranslation('publication');

    const index = contributor.sequence - 1;
    const baseFieldName = `${ContributorFieldNames.CONTRIBUTORS}[${index}]`;

    return (
      <TableRow tabIndex={0} key={contributor.identity.id}>
        <TableCell align="left">
          <SubHeading>#{contributor.sequence}</SubHeading>
          <SubHeading>
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
          </SubHeading>

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
                    value={field.value || ''}
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
          <Button color="secondary" variant="contained" size="small" onClick={onRemoveContributorClick}>
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
  onSortEnd: ({ oldIndex, newIndex }: any) => void;
  setUnverifiedContributor: (unverifiedContributor: UnverifiedContributor) => void;
}

const SortableList = SortableContainer(({ contributors, onDelete, setUnverifiedContributor }: SortableListProps) => {
  const { t } = useTranslation('publication');
  const [contributorToRemove, setContributorToRemove] = useState<Contributor | null>(null);

  const closeConfirmDialog = () => {
    setContributorToRemove(null);
  };

  return (
    <StyledContainer>
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
          text={t('contributors.confirm_remove_contributor_text', {
            contributorName: contributorToRemove.identity.name,
          })}
          onAccept={() => {
            onDelete(contributorToRemove.sequence - 1);
            closeConfirmDialog();
          }}
          onCancel={closeConfirmDialog}
        />
      )}
    </StyledContainer>
  );
});

interface SortableTableProps {
  push: (obj: any) => void;
  remove: (index: number) => void;
  move: (oldIndex: number, newIndex: number) => void;
  replace: (index: number, value: any) => void;
}

const SortableTable: FC<SortableTableProps> = ({ push, remove, move, replace }) => {
  const { t } = useTranslation('publication');
  const dispatch = useDispatch();
  const {
    setFieldValue,
    values: {
      entityDescription: { contributors },
    },
  }: FormikProps<FormikPublication> = useFormikContext();
  const [openContributorModal, setOpenContributorModal] = useState(false);
  const [unverifiedContributor, setUnverifiedContributor] = useState<UnverifiedContributor | null>(null);

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

  const updateSequences = useCallback(() => {
    // Ensure that sequence values are continuous
    for (let index in contributors) {
      const correctSequence = +index + 1;
      if (contributors[index].sequence !== correctSequence) {
        setFieldValue(
          `${ContributorFieldNames.CONTRIBUTORS}[${index}].${SpecificContributorFieldNames.SEQUENCE}`,
          correctSequence
        );
      }
    }
  }, [setFieldValue, contributors]);

  useEffect(() => {
    updateSequences();
  }, [updateSequences, contributors.length]);

  const handleOnSortEnd = ({ oldIndex, newIndex }: any) => {
    move(oldIndex, newIndex);
    updateSequences();
  };

  const onAuthorSelected = (authority: Authority) => {
    if (contributors.some((contributor) => contributor.identity.arpId === authority.systemControlNumber)) {
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
        affiliations: authority.orgunitids.map((unitId) => ({
          type: BackendTypeNames.ORGANIZATION,
          id: getUnitUri(unitId),
        })),
      };
      push(newContributor);
    } else {
      const verifiedContributor: Contributor = {
        ...contributors[unverifiedContributor.index],
        identity,
      };
      replace(unverifiedContributor.index, verifiedContributor);
    }
  };

  return (
    <>
      <SortableList
        contributors={contributors}
        onSortEnd={handleOnSortEnd}
        onDelete={(index) => remove(index)}
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
