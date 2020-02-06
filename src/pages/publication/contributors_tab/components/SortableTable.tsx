import arrayMove from 'array-move';
import React, { FC } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

import { Checkbox, FormControlLabel, Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import { Contributor } from '../../../../types/contributor.types';
import { FormikProps, useFormikContext } from 'formik';
import { Publication } from '../../../../types/publication.types';

interface SortableItemProps {
  contributor: Contributor;
  placement: number;
}

const SortableItem = SortableElement(({ contributor, placement }: SortableItemProps) => {
  const { setFieldValue }: FormikProps<Publication> = useFormikContext();

  const handleChange = (event: any) => {
    setFieldValue(`contributors[${placement - 1}].corresponding`, event.target.checked);
  };

  return (
    <TableRow tabIndex={0} key={contributor.name}>
      <TableCell component="th" scope="row">
        <div>{contributor.name}</div>
        <FormControlLabel
          control={<Checkbox checked={contributor.corresponding} onChange={handleChange} value="checkedA" />}
          label="Korresponderende"
        />
        <div>
          {contributor.corresponding && (
            <span>
              Email: <input />
            </span>
          )}
        </div>
      </TableCell>
      <TableCell align="left">
        {contributor.institutions.map(institution => (
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
}

const SortableTable: FC<SortableTableProps> = ({ listOfContributors }) => {
  const { setFieldValue }: FormikProps<Publication> = useFormikContext();

  const onSortEnd = ({ oldIndex, newIndex }: any) => {
    const reorderedList = arrayMove(listOfContributors, oldIndex, newIndex);
    setFieldValue('contributors', reorderedList);
  };
  return <SortableList contributors={listOfContributors} onSortEnd={onSortEnd} />;
};

export default SortableTable;
