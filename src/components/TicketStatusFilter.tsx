import { Checkbox, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { TicketStatus } from '../types/publication_types/ticket.types';
import { dataTestId } from '../utils/dataTestIds';

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
    <FormControl variant="outlined" size="small" sx={{ minWidth: '15rem' }}>
      <InputLabel id="demo-simple-select-outlined-label">Status</InputLabel>
      <Select
        data-testid={dataTestId.myPage.myMessages.ticketStatusField}
        multiple
        value={selectedStatuses}
        onChange={handleChange}
        renderValue={(selected) => {
          if (selected.length === ticketStatusValues.length) {
            return [t('my_page.messages.all_ticket_types')];
          } else {
            return selected.map((value) => t(`my_page.messages.ticket_types.${value as TicketStatus}`)).join(', ');
          }
        }}
        label="Status">
        {ticketStatusValues.map((status) => (
          <MenuItem sx={{ height: '2.5rem' }} key={status} value={status}>
            <Checkbox checked={selectedStatuses.includes(status)} />
            <Typography>{t(`my_page.messages.ticket_types.${status}`)}</Typography>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
