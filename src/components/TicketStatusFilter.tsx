import { Checkbox, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { TicketStatus } from '../types/publication_types/ticket.types';

const ticketStatusValues: TicketStatus[] = ['New', 'Pending', 'Closed', 'Completed'];

export const TicketStatusFilter = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);
  const selectedStatuses = searchParams.get('ticketStatus')?.split(',') || ticketStatusValues;

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const newSelectedStatuses = event.target.value as TicketStatus[];
    if (newSelectedStatuses.length > 0) {
      searchParams.set('ticketStatus', newSelectedStatuses.join(','));
    } else {
      searchParams.delete('ticketStatus');
    }
    history.push({ search: searchParams.toString() });
  };

  return (
    <Select
      size="small"
      sx={{ minWidth: '20rem' }}
      multiple
      value={selectedStatuses}
      onChange={handleChange}
      renderValue={(selected) => selected.join(', ')}>
      {ticketStatusValues.map((status) => (
        <MenuItem sx={{ height: 'fit-content' }} key={status} value={status}>
          <Checkbox checked={selectedStatuses.includes(status)} />
          <Typography>{t(`my_page.messages.ticket_types.${status}`)}</Typography>
        </MenuItem>
      ))}
    </Select>
  );
};
