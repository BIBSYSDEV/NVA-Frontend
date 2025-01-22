import { Checkbox, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { TicketSearchParam } from '../api/searchApi';
import { TicketStatus } from '../types/publication_types/ticket.types';
import { dataTestId } from '../utils/dataTestIds';
import { syncParamsWithSearchFields } from '../utils/searchHelpers';

const labelId = 'status-filter-select';

interface TicketStatusFilterProps {
  options: TicketStatus[];
}

export const TicketStatusFilter = ({ options }: TicketStatusFilterProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentStatusFilter = (searchParams.get(TicketSearchParam.Status)?.split(',') ?? []) as TicketStatus[];
  const selectedOptions = currentStatusFilter.filter((status) => options.includes(status));
  const otherSelectedStatuses = currentStatusFilter.filter((status) => !options.includes(status));

  const handleChange = (event: SelectChangeEvent<TicketStatus[]>) => {
    const newSelectedOptions = event.target.value as TicketStatus[];
    const newSelectedStatuses = [...otherSelectedStatuses, ...newSelectedOptions];

    const syncedParams = syncParamsWithSearchFields(searchParams);
    if (newSelectedStatuses.length > 0) {
      syncedParams.set(TicketSearchParam.Status, newSelectedStatuses.join(','));
    } else {
      syncedParams.delete(TicketSearchParam.Status);
    }
    navigate({ search: syncedParams.toString() });
  };

  return (
    <FormControl size="small" sx={{ width: '100%' }}>
      <InputLabel id={labelId}>{t('tasks.status')}</InputLabel>
      <Select
        labelId={labelId}
        label={t('tasks.status')}
        data-testid={dataTestId.myPage.myMessages.ticketStatusField}
        multiple
        value={selectedOptions}
        onChange={handleChange}
        renderValue={(selected) => {
          if (selected.length === options.length) {
            return t('my_page.messages.all_ticket_types');
          } else {
            return selected.map((value) => t(`my_page.messages.ticket_types.${value}`)).join(', ');
          }
        }}>
        {options.map((status) => (
          <MenuItem sx={{ height: '2.5rem' }} key={status} value={status}>
            <Checkbox checked={selectedOptions.includes(status)} />
            <Typography>{t(`my_page.messages.ticket_types.${status}`)}</Typography>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
