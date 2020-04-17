import React, { FC, useState, useEffect } from 'react';
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

import { ContributorFieldNames, SpecificContributorFieldNames } from '../../../../types/publicationFieldNames';
import { Contributor, emptyContributor } from '../../../../types/contributor.types';
import { FormikPublication } from '../../../../types/publication.types';
import SubHeading from '../../../../components/SubHeading';
import AddContributor from '../AddContributorModal';
import styled from 'styled-components';
import AffiliationsCell from './AffiliationsCell';

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
  placement: number;
  onDelete: (index: number) => void;
  setUnverifiedContributor: (unverifiedContributor: UnverifiedContributor) => void;
}

const SortableItem = SortableElement(
  ({ contributor, placement, onDelete, setUnverifiedContributor }: SortableItemProps) => {
    const { t } = useTranslation();

    const index = placement - 1;
    const baseFieldName = `${ContributorFieldNames.CONTRIBUTORS}[${index}]`;

    return (
      <TableRow tabIndex={0} key={contributor.identity.id}>
        <TableCell align="left">
          <SubHeading>
            {contributor.identity.name}{' '}
            {contributor.identity.arpId ? (
              <Tooltip title={t('publication:contributors.known_author_identity')}>
                <StyledCheckIcon />
              </Tooltip>
            ) : (
              <Tooltip title={t('publication:contributors.unknown_author_identity')}>
                <StyledWarningIcon />
              </Tooltip>
            )}
          </SubHeading>

          <Field name={`${baseFieldName}.${SpecificContributorFieldNames.CORRESPONDING}`}>
            {({ field }: FieldProps) => (
              <FormControlLabel
                control={<Checkbox checked={field.value} {...field} />}
                label={t('publication:contributors.corresponding')}
              />
            )}
          </Field>
          <div>
            {contributor.correspondingAuthor && (
              <Field name={`${baseFieldName}.${SpecificContributorFieldNames.EMAIL}`}>
                {({ field, meta: { error, touched } }: FieldProps) => (
                  <StyledEmailTextField
                    variant="outlined"
                    label={t('common:email')}
                    {...field}
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
              onClick={() =>
                setUnverifiedContributor({
                  name: contributor.identity.name,
                  index: index,
                })
              }>
              {t('publication:contributors.connect_author_identity')}
            </Button>
          )}
        </TableCell>
        <TableCell align="left">
          {contributor.identity && (
            <AffiliationsCell
              affiliations={contributor.affiliations}
              baseFieldName={baseFieldName}
              contributorName={contributor.identity.name}
            />
          )}
        </TableCell>
        <TableCell align="right">
          <div>{placement}</div>
          <div>
            <Button color="secondary" onClick={() => onDelete(index)}>
              <DeleteIcon />
              {t('common:remove')}
            </Button>
          </div>
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

const SortableList = SortableContainer(({ contributors, onDelete, setUnverifiedContributor }: SortableListProps) => (
  <Table>
    <TableBody>
      {contributors.map((contributor: Contributor, index: number) => (
        <SortableItem
          index={index}
          contributor={contributor}
          key={contributor.identity.id || contributor.identity.name}
          placement={index + 1}
          onDelete={onDelete}
          setUnverifiedContributor={setUnverifiedContributor}
        />
      ))}
    </TableBody>
  </Table>
));

interface SortableTableProps {
  listOfContributors: Contributor[];
  push: (obj: any) => void;
  remove: (index: number) => void;
  swap: (oldIndex: number, newIndex: number) => void;
  replace: (index: number, value: any) => void;
}

const SortableTable: FC<SortableTableProps> = ({ listOfContributors, push, remove, swap, replace }) => {
  const { setFieldValue, values }: FormikProps<FormikPublication> = useFormikContext();
  const [openContributorModal, setOpenContributorModal] = useState(false);
  const [unverifiedContributor, setUnverifiedContributor] = useState<UnverifiedContributor | null>(null);
  const { t } = useTranslation('publication');

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

  const handleOnSortEnd = ({ oldIndex, newIndex }: any) => {
    swap(oldIndex, newIndex);
    for (let index in values.entityDescription.contributors) {
      setFieldValue(
        `${ContributorFieldNames.CONTRIBUTORS}[${index}].${SpecificContributorFieldNames.SEQUENCE}`,
        +index
      );
    }
  };

  return (
    <>
      <SortableList
        contributors={listOfContributors}
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
        {t('contributors.add_author')}
      </StyledAddAuthorButton>
      <AddContributor
        initialSearchTerm={unverifiedContributor?.name}
        open={openContributorModal}
        toggleModal={toggleContributorModal}
        onAuthorSelected={(authority) => {
          const contributor: Contributor = {
            ...emptyContributor,
            // TODO: add institution when available from backend
            // institutions: authority.orgunitids.map(orgunit => ({
            //   id: orgunit,
            //   name: orgunit,
            // })),
            identity: {
              ...emptyContributor.identity,
              arpId: authority.systemControlNumber,
              orcId: authority.orcids.length > 0 ? authority.orcids[0] : '',
              name: authority.name,
            },
            sequence: listOfContributors.length,
          };

          !unverifiedContributor ? push(contributor) : replace(unverifiedContributor.index, contributor);
        }}
      />
    </>
  );
};

export default SortableTable;
