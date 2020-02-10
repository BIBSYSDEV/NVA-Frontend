import arrayMove from 'array-move';
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
import { Contributor } from '../../../../types/contributor.types';
import { FormikProps, useFormikContext, Field } from 'formik';
import { Publication } from '../../../../types/publication.types';
import AddContributor from '../AddContributor';
import { useTranslation } from 'react-i18next';
import DeleteIcon from '@material-ui/icons/Delete';

import FormCardSubHeading from '../../../../components/FormCard/FormCardSubHeading';

interface SortableItemProps {
  contributor: Contributor;
  placement: number;
  onDelete: (index: number) => void;
}

const SortableItem = SortableElement(({ contributor, placement, onDelete }: SortableItemProps) => {
  const { t } = useTranslation();

  const index = placement - 1;

  return (
    <TableRow tabIndex={0} key={contributor.name}>
      <TableCell align="left">
        <FormCardSubHeading>{contributor.name}</FormCardSubHeading>
        <Field name={`contributors[${index}].corresponding`}>
          {({ field }: any) => (
            <FormControlLabel control={<Checkbox checked={field.value} {...field} />} label="Korresponderende" />
          )}
        </Field>
        <div>
          {contributor.corresponding && (
            <Field name={`contributors[${index}].email`}>
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
          key={`item-${contributor.name}`}
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
}

const SortableTable: FC<SortableTableProps> = ({ listOfContributors, push, remove }) => {
  const { setFieldValue }: FormikProps<Publication> = useFormikContext();

  const onSortEnd = ({ oldIndex, newIndex }: any) => {
    const reorderedList = arrayMove(listOfContributors, oldIndex, newIndex);
    setFieldValue('contributors', reorderedList);
  };

  return (
    <>
      <SortableList
        contributors={listOfContributors}
        onSortEnd={onSortEnd}
        onDelete={index => remove(index)}
        distance={10}
      />
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
