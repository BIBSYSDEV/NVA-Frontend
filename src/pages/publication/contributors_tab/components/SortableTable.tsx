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
import { Field } from 'formik';
import AddContributor from '../AddContributor';
import { useTranslation } from 'react-i18next';
import DeleteIcon from '@material-ui/icons/Delete';

import SubHeading from '../../../../components/SubHeading';
import { removeDuplicatesByScn } from '../../../../utils/helpers';

interface SortableItemProps {
  contributor: Contributor;
  placement: number;
  onDelete: (index: number) => void;
}

const SortableItem = SortableElement(({ contributor, placement, onDelete }: SortableItemProps) => {
  const { t } = useTranslation();

  const index = placement - 1;

  return (
    <TableRow tabIndex={0} key={contributor.systemControlNumber}>
      <TableCell align="left">
        <SubHeading>{contributor.name}</SubHeading>
        <Field name={`contributors[${index}].corresponding`}>
          {({ field }: any) => (
            <FormControlLabel
              control={<Checkbox checked={field.value} {...field} />}
              label={t('publication:contributors.corresponding')}
            />
          )}
        </Field>
        <div>
          {contributor.corresponding && (
            <Field name={`contributors[${index}].email`}>
              {({ field }: any) => <TextField variant="outlined" label={t('common:email')} {...field} />}
            </Field>
          )}
        </div>
      </TableCell>
      <TableCell align="left">
        {contributor.institutions?.map(institution => (
          <div key={`${institution.id}`}>{institution.name}</div>
        ))}
      </TableCell>
      <TableCell align="right">
        <div>
          <div>{placement}</div>
          <div>
            <Button color="secondary" onClick={() => onDelete(index)}>
              <DeleteIcon />
              {t('common:remove')}
            </Button>
          </div>
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

const SortableList = SortableContainer(({ contributors, onDelete }: SortableListProps) => {
  const uniqueContributors = removeDuplicatesByScn(contributors);
  return (
    <Table>
      <TableBody>
        {uniqueContributors.map((contributor: Contributor, index: number) => (
          <SortableItem
            index={index}
            contributor={contributor}
            key={contributor.systemControlNumber}
            placement={index + 1}
            onDelete={onDelete}
          />
        ))}
      </TableBody>
    </Table>
  );
});

interface SortableTableProps {
  listOfContributors: Contributor[];
  push: (obj: any) => void;
  remove: (index: number) => void;
  swap: (oldIndex: number, newIndex: number) => void;
}

const SortableTable: FC<SortableTableProps> = ({ listOfContributors, push, remove, swap }) => (
  <>
    <SortableList
      contributors={listOfContributors}
      onSortEnd={({ oldIndex, newIndex }: any) => swap(oldIndex, newIndex)}
      onDelete={index => remove(index)}
      distance={10}
    />
    <AddContributor
      onAuthorSelected={authority => {
        const contributor: Contributor = {
          ...emptyContributor,
          name: authority.name,
          systemControlNumber: authority.systemControlNumber,
          institutions: authority.orgunitids.map(orgunit => ({
            id: orgunit,
            name: orgunit,
          })),
        };
        push(contributor);
      }}
    />
  </>
);

export default SortableTable;
