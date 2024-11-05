import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActiveOutlined';
import { Badge, Button } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { TicketSearchParam, fetchCustomerTickets } from '../api/searchApi';
import { RootState } from '../redux/store';
import { TicketStatus } from '../types/publication_types/ticket.types';
import { dataTestId } from '../utils/dataTestIds';
import { syncParamsWithSearchFields, taskNotificationsParams } from '../utils/searchHelpers';

const statusNew: TicketStatus = 'New';

export const DialoguesWithoutCuratorButton = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);
  const currentStatusFilter = (searchParams.get(TicketSearchParam.Status)?.split(',') ?? []) as TicketStatus[];
  const newStatusIsSelected = currentStatusFilter.includes(statusNew);

  const notificationsQuery = useQuery({
    enabled: user?.isDoiCurator || user?.isSupportCurator || user?.isPublishingCurator,
    queryKey: ['taskNotifications', taskNotificationsParams],
    queryFn: () => fetchCustomerTickets(taskNotificationsParams),
    meta: { errorMessage: false },
  });

  const unassignedNotificationsCount =
    notificationsQuery.data?.aggregations?.status?.find((notification) => notification.key === 'New')?.count ?? 0;

  const toggleDialoguesWithoutCurators = () => {
    const syncedParams = syncParamsWithSearchFields(searchParams);
    if (newStatusIsSelected) {
      const newValues = currentStatusFilter.filter((status) => status !== statusNew);
      if (newValues.length > 0) {
        syncedParams.set(TicketSearchParam.Status, newValues.join(','));
      } else {
        syncedParams.delete(TicketSearchParam.Status);
      }
    } else {
      syncedParams.set(TicketSearchParam.Status, [...currentStatusFilter, statusNew].join(','));
    }
    history.push({ search: syncedParams.toString() });
  };

  return (
    <Button
      fullWidth
      size="medium"
      variant="outlined"
      color="primary"
      sx={{ textTransform: 'none' }}
      startIcon={newStatusIsSelected ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
      endIcon={
        unassignedNotificationsCount > 0 ? (
          <Badge badgeContent={<NotificationsActiveIcon fontSize="small" />} sx={{ ml: '1rem' }} />
        ) : undefined
      }
      onClick={toggleDialoguesWithoutCurators}
      title={t('tasks.include_tasks_without_curator')}
      data-testid={dataTestId.tasksPage.dialoguesWithoutCuratorButton}>
      {t('tasks.include_tasks_without_curator')}
    </Button>
  );
};
