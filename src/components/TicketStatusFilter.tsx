import { Checkbox, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useState } from 'react';
import { TicketStatus } from '../types/publication_types/ticket.types';

type SelectedStatusState = {
  [key in TicketStatus]: boolean;
};

export const TicketStatusFilter = () => {
  const [selectedStatuses, setSelectedStatuses] = useState<SelectedStatusState>({
    New: true,
    Pending: true,
    Completed: true,
    Closed: true,
  });

  const selectedStatusesArray = Object.entries(selectedStatuses)
    .filter(([_, selected]) => selected)
    .map(([key]) => key);

  const handleChange = (event: SelectChangeEvent<typeof selectedStatusesArray>) => {
    setSelectedStatuses(
      Object.fromEntries(
        Object.entries(selectedStatuses).map(([status]) => [status, event.target.value.includes(status)])
      ) as SelectedStatusState
    );
  };

  return (
    <Select
      size="small"
      multiple
      value={selectedStatusesArray}
      defaultValue={selectedStatusesArray}
      onChange={handleChange}
      renderValue={(selected) => selected.join(', ')}>
      {Object.entries(selectedStatuses).map(([status, selected]) => (
        <MenuItem key={status} value={status}>
          <Checkbox checked={selected} />
          <ListItemText primary={status} />
        </MenuItem>
      ))}
    </Select>
  );
};
