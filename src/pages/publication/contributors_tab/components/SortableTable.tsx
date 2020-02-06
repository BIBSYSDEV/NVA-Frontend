import arrayMove from 'array-move';
import React, { FC, useState } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

import { Checkbox, FormControlLabel, Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import { Contributor } from '../../../../types/contributor.types';

interface SortableItemProps {
  contributor: Contributor;
  placement: number;
}

const SortableItem = SortableElement(({ contributor, placement }: SortableItemProps) => {
  const [checked, setChecked] = useState(contributor.corresponding);

  const handleChange = (event: any) => {
    setChecked(event.target.checked);
  };
  return (
    <TableRow tabIndex={0} key={contributor.name}>
      <TableCell component="th" scope="row">
        <div>{contributor.name}</div>
        <FormControlLabel
          control={<Checkbox checked={checked} onChange={handleChange} value="checkedA" />}
          label="Korresponderende"
        />
      </TableCell>
      <TableCell align="right" />
      <TableCell align="left">
        {contributor.institutions.map(institution => (
          <div key={`${institution}`}>{institution}</div>
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
  const [contributors, setContributors] = useState<Contributor[]>(listOfContributors);

  const onSortEnd = ({ oldIndex, newIndex }: any) => {
    setContributors(contributors => arrayMove(contributors, oldIndex, newIndex));
  };
  return <SortableList contributors={contributors} onSortEnd={onSortEnd} />;
};

export default SortableTable;
