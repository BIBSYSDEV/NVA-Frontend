import { ChatBubble } from '@mui/icons-material';
import { Badge, Box, Button } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { TicketSearchParam, fetchCustomerTickets } from '../api/searchApi';
import { RootState } from '../redux/store';
import { TicketStatus } from '../types/publication_types/ticket.types';
import { dataTestId } from '../utils/dataTestIds';
import { taskNotificationsParams } from '../utils/searchHelpers';

const statusNew: TicketStatus = 'New';

export const DialoguesWithoutCuratorButton = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);

  const dialoguesWithoutCuratorSelected =
    searchParams.get(TicketSearchParam.Status) === statusNew && !searchParams.get(TicketSearchParam.Assignee);

  const notificationsQuery = useQuery({
    enabled: user?.isDoiCurator || user?.isSupportCurator || user?.isPublishingCurator,
    queryKey: ['taskNotifications', taskNotificationsParams],
    queryFn: () => fetchCustomerTickets(taskNotificationsParams),
    meta: { errorMessage: false },
  });

  const unassignedNotificationsCount = notificationsQuery.data?.aggregations?.status?.find(
    (notification) => notification.key === 'New'
  )?.count;

  const toggleDialoguesWithoutCurators = () => {
    if (dialoguesWithoutCuratorSelected) {
      searchParams.delete(TicketSearchParam.Status);
    } else {
      searchParams.set(TicketSearchParam.Status, statusNew);
      searchParams.delete(TicketSearchParam.Assignee);
    }
    history.push({ search: searchParams.toString() });
  };

  return (
    <Button
      fullWidth
      size="medium"
      variant={dialoguesWithoutCuratorSelected ? 'contained' : 'outlined'}
      color="primary"
      sx={{ textTransform: 'none' }}
      startIcon={<ChatBubble />}
      endIcon={<Badge badgeContent={unassignedNotificationsCount} sx={{ ml: '1rem' }} />}
      onClick={toggleDialoguesWithoutCurators}
      title={t('tasks.dialogues_without_curator')}
      data-testid={dataTestId.tasksPage.dialoguesWithoutCuratorButton}>
      <Box component="span" sx={{ whiteSpace: 'nowrap' }}>
        {t('tasks.dialogues_without_curator')}
      </Box>
    </Button>
  );
};
