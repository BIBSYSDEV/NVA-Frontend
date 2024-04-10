import { Checkbox, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { TicketSearchParam } from '../api/searchApi';
import { TicketStatus, ticketStatusValues } from '../types/publication_types/ticket.types';
import { dataTestId } from '../utils/dataTestIds';

export const TicketStatusFilter = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);
  const selectedStatuses = (searchParams.get(TicketSearchParam.Status)?.split(',') ??
    ticketStatusValues) as TicketStatus[];

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const newSelectedStatuses = event.target.value as TicketStatus[];

    if (newSelectedStatuses.length > 0) {
      searchParams.set(TicketSearchParam.Status, newSelectedStatuses.join(','));
    } else {
      searchParams.delete(TicketSearchParam.Status);
    }

    history.push({ search: searchParams.toString() });
  };

  return (
    <FormControl variant="outlined" size="small" sx={{ width: '100%' }}>
      <InputLabel id={'status-filter-select'}>{t('tasks.status')}</InputLabel>
      <Select
        labelId={'status-filter-select'}
        data-testid={dataTestId.myPage.myMessages.ticketStatusField}
        multiple
        value={selectedStatuses}
        onChange={handleChange}
        renderValue={(selected: TicketStatus[]) => {
          if (selected.length === ticketStatusValues.length) {
            return t('my_page.messages.all_ticket_types');
          } else {
            return selected.map((value) => t(`my_page.messages.ticket_types.${value}`)).join(', ');
          }
        }}
        label={t('tasks.status')}>
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
