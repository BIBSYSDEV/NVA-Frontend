import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { TicketSearchParam } from '../../../api/searchApi';
import { User } from '../../../types/user.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { syncParamsWithSearchFields } from '../../../utils/searchHelpers';
import { SHOW_ALL_VIEWED_BY_VALUE, useTicketsParams } from '../_hooks/useTicketsParams';

const viewedByLabelId = 'viewed-by-select';

interface TicketListDisplayOptionsDropdownProps {
  user: User;
}

export const TicketListDisplayOptionsDropdown = ({ user }: TicketListDisplayOptionsDropdownProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { viewedByNot, searchParams } = useTicketsParams();

  return (
    <FormControl fullWidth>
      <InputLabel id={viewedByLabelId}>{t('tasks.display_options')}</InputLabel>
      <Select
        data-testid={dataTestId.tasksPage.unreadSearchSelect}
        size="small"
        value={viewedByNot}
        labelId={viewedByLabelId}
        label={t('tasks.display_options')}
        onChange={(event) => {
          const value = event.target.value;
          const syncedParams = syncParamsWithSearchFields(searchParams);
          if (value === SHOW_ALL_VIEWED_BY_VALUE) {
            syncedParams.delete(TicketSearchParam.ViewedByNot);
          } else {
            syncedParams.set(TicketSearchParam.ViewedByNot, value);
          }
          syncedParams.delete(TicketSearchParam.From);
          navigate({ search: syncedParams.toString() });
        }}>
        <MenuItem value={SHOW_ALL_VIEWED_BY_VALUE}>{t('common.show_all')}</MenuItem>
        <MenuItem value={user.nvaUsername}>{t('tasks.unread_only')}</MenuItem>
      </Select>
    </FormControl>
  );
};
