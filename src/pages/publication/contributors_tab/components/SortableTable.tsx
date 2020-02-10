import arrayMove from 'array-move';
import React, { FC } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

import { Checkbox, FormControlLabel, Table, TableBody, TableCell, TableRow, TextField } from '@material-ui/core';
import { Contributor } from '../../../../types/contributor.types';
import { FormikProps, useFormikContext, Field } from 'formik';
import { Publication } from '../../../../types/publication.types';
import AddContributor from '../AddContributor';
import { useTranslation } from 'react-i18next';

interface SortableItemProps {
  contributor: Contributor;
  placement: number;
}

const SortableItem = SortableElement(({ contributor, placement }: SortableItemProps) => {
  const { t } = useTranslation();

  return (
    <TableRow tabIndex={0} key={contributor.name}>
      <TableCell component="th" scope="row">
        <div>{contributor.name}</div>
        <Field name={`contributors[${placement - 1}].corresponding`}>
          {({ field }: any) => (
            <FormControlLabel control={<Checkbox checked={field.value} {...field} />} label="Korresponderende" />
          )}
        </Field>
        <div>
          {contributor.corresponding && (
            <Field name={`contributors[${placement - 1}].email`}>
              {({ field }: any) => <TextField variant="outlined" label={t('profile:email')} {...field} />}
            </Field>
          )}
        </div>
      </TableCell>
      <TableCell align="left">
        {contributor.institutions?.map(institution => (
          <div key={`${institution.name}`}>{institution.name}</div>
        ))}
      </TableCell>
      <TableCell align="right">{placement}</TableCell>
    </TableRow>
  );
});

interface SortableListProps {
  contributors: Contributor[];
  onSortEnd: ({ oldIndex, newIndex }: any) => void;
}

const SortableList = SortableContainer(({ contributors }: SortableListProps) => (
  <Table>
    <TableBody>
      {contributors.map((contributor: Contributor, index: number) => (
        <SortableItem index={index} contributor={contributor} key={`item-${contributor.name}`} placement={index + 1} />
      ))}
    </TableBody>
  </Table>
));

interface SortableTableProps {
  listOfContributors: Contributor[];
  push: (obj: any) => void;
}

const SortableTable: FC<SortableTableProps> = ({ listOfContributors, push }) => {
  const { setFieldValue }: FormikProps<Publication> = useFormikContext();

  const onSortEnd = ({ oldIndex, newIndex }: any) => {
    const reorderedList = arrayMove(listOfContributors, oldIndex, newIndex);
    setFieldValue('contributors', reorderedList);
  };
  return (
    <>
      <SortableList contributors={listOfContributors} onSortEnd={onSortEnd} />
      <AddContributor
        onAdd={authority => {
          const contributor: Contributor = {
            name: authority.name,
            systemControlNumber: authority.systemControlNumber,
            institutions: [],
            email: '',
            type: '',
            corresponding: false,
          };
          push(contributor);
        }}
      />
    </>
  );
};

export default SortableTable;
