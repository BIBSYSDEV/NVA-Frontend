import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActiveOutlined';
import { Button } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { fetchCustomerTickets, TicketSearchParam } from '../api/searchApi';
import { RootState } from '../redux/store';
import { TicketStatus } from '../types/publication_types/ticket.types';
import { dataTestId } from '../utils/dataTestIds';
import { getTaskNotificationsParams, syncParamsWithSearchFields } from '../utils/searchHelpers';

const statusNew: TicketStatus = 'New';

export const DialoguesWithoutCuratorButton = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentStatusFilter = (searchParams.get(TicketSearchParam.Status)?.split(',') ?? []) as TicketStatus[];
  const newStatusIsSelected = currentStatusFilter.includes(statusNew);

  const tasksNotificationParams = getTaskNotificationsParams(user);
  const notificationsQuery = useQuery({
    enabled: user?.isDoiCurator || user?.isSupportCurator || user?.isPublishingCurator,
    queryKey: ['taskNotifications', tasksNotificationParams],
    queryFn: () => fetchCustomerTickets(tasksNotificationParams),
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

    syncedParams.delete(TicketSearchParam.From);
    navigate({ search: syncedParams.toString() });
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
          <NotificationsActiveIcon
            sx={{
              width: '1.5rem',
              height: '1.5rem',
              bgcolor: 'info.main',
              color: 'white',
              borderRadius: '50%',
              padding: '3px',
            }}
          />
        ) : undefined
      }
      onClick={toggleDialoguesWithoutCurators}
      title={t('tasks.include_tasks_without_curator')}
      data-testid={dataTestId.tasksPage.dialoguesWithoutCuratorButton}>
      {t('tasks.include_tasks_without_curator')}
    </Button>
  );
};
