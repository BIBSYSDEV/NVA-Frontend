import React, { FC } from 'react';
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
} from '@material-ui/core';
import { Contributor, emptyContributor } from '../../../../types/contributor.types';
import { Field, FieldProps, FormikProps, useFormikContext } from 'formik';
import AddContributor from '../AddContributor';
import { useTranslation } from 'react-i18next';
import DeleteIcon from '@material-ui/icons/Delete';

import SubHeading from '../../../../components/SubHeading';
import { FormikPublication } from '../../../../types/publication.types';
import { ContributorFieldNames } from '../../../../types/publicationFieldNames';

interface SortableItemProps {
  contributor: Contributor;
  placement: number;
  onDelete: (index: number) => void;
}

const SortableItem = SortableElement(({ contributor, placement, onDelete }: SortableItemProps) => {
  const { t } = useTranslation();

  const index = placement - 1;

  return (
    <TableRow tabIndex={0} key={contributor.identity.id}>
      <TableCell align="left">
        <SubHeading>{contributor.identity.name}</SubHeading>
        <Field name={`${ContributorFieldNames.CONTRIBUTORS}[${index}].corresponding`}>
          {({ field }: FieldProps) => (
            <FormControlLabel
              control={<Checkbox checked={field.value} {...field} />}
              label={t('publication:contributors.corresponding')}
            />
          )}
        </Field>
        <div>
          {contributor.corresponding && (
            <Field name={`${ContributorFieldNames.CONTRIBUTORS}[${index}].email`}>
              {({ field }: FieldProps) => <TextField variant="outlined" label={t('common:email')} {...field} />}
            </Field>
          )}
        </div>
      </TableCell>
      <TableCell align="left">
        {contributor.affiliations?.map((affiliation) => (
          <div key={`${affiliation.id}`}>{affiliation.name}</div>
        ))}
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
});

interface SortableListProps {
  contributors: Contributor[];
  onDelete: (index: number) => void;
  onSortEnd: ({ oldIndex, newIndex }: any) => void;
}

const SortableList = SortableContainer(({ contributors, onDelete }: SortableListProps) => (
  <Table>
    <TableBody>
      {contributors.map((contributor: Contributor, index: number) => (
        <SortableItem
          index={index}
          contributor={contributor}
          key={contributor.identity.id || contributor.identity.name}
          placement={index + 1}
          onDelete={onDelete}
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
}

const SortableTable: FC<SortableTableProps> = ({ listOfContributors, push, remove, swap }) => {
  const { setFieldValue, values }: FormikProps<FormikPublication> = useFormikContext();

  const handleOnSortEnd = ({ oldIndex, newIndex }: any) => {
    swap(oldIndex, newIndex);
    for (let index in values.entityDescription.contributors) {
      setFieldValue(`${ContributorFieldNames.CONTRIBUTORS}[${index}].sequence`, +index);
    }
  };
  return (
    <>
      <SortableList
        contributors={listOfContributors}
        onSortEnd={handleOnSortEnd}
        onDelete={(index) => remove(index)}
        distance={10}
      />
      <AddContributor
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
              id: authority.systemControlNumber,
              name: authority.name,
            },
            sequence: listOfContributors.length,
          };
          push(contributor);
        }}
      />
    </>
  );
};

export default SortableTable;
