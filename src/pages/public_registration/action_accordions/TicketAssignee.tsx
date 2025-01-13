import { Box, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useFetchUserQuery } from '../../../api/hooks/useFetchUserQuery';
import { updateTicket } from '../../../api/registrationApi';
import { AssigneeSelector } from '../../../components/AssigneeSelector';
import { Avatar } from '../../../components/Avatar';
import { setNotification } from '../../../redux/notificationSlice';
import { RootState } from '../../../redux/store';
import { Ticket } from '../../../types/publication_types/ticket.types';
import { RoleName } from '../../../types/user.types';
import { UrlPathTemplate } from '../../../utils/urlPaths';
import { getFullName } from '../../../utils/user-helpers';

interface TicketAssigneeProps {
  ticket: Ticket;
  refetchTickets: () => Promise<void>;
}

export const TicketAssignee = ({ ticket, refetchTickets }: TicketAssigneeProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((store: RootState) => store.user);

  const canEditTicket =
    !!(ticket.type === 'DoiRequest' && user?.isDoiCurator) ||
    !!(ticket.type === 'GeneralSupportCase' && user?.isSupportCurator) ||
    !!(ticket.type === 'PublishingRequest' && user?.isPublishingCurator);

  const ticketMutation = useMutation({
    mutationFn: async (assigneeUsername: string) => {
      await updateTicket(ticket.id, { assignee: assigneeUsername });
      await refetchTickets();
    },
    onSuccess: () => {
      dispatch(setNotification({ message: t('feedback.success.update_ticket_assignee'), variant: 'success' }));
    },
    onError: () => dispatch(setNotification({ message: t('feedback.error.update_ticket_assignee'), variant: 'error' })),
  });

  const isOnTaskPage = window.location.pathname.startsWith(UrlPathTemplate.TasksDialogue);
  const canSetAssignee = isOnTaskPage && canEditTicket && (ticket.status === 'Pending' || ticket.status === 'New');

  return isOnTaskPage ? (
    <AssigneeSelector
      assignee={ticket.assignee}
      canSetAssignee={canSetAssignee}
      onSelectAssignee={async (assignee) => {
        if (canEditTicket) {
          await ticketMutation.mutateAsync(assignee);
        }
      }}
      isUpdating={ticketMutation.isPending}
      roleFilter={
        ticket.type === 'PublishingRequest'
          ? RoleName.PublishingCurator
          : ticket.type === 'DoiRequest'
            ? RoleName.DoiCurator
            : RoleName.SupportCurator
      }
    />
  ) : (
    <UnselectableAssignee assignee={ticket.assignee} />
  );
};

interface UnselectableAssigneeProps {
  assignee?: string;
}

const UnselectableAssignee = ({ assignee }: UnselectableAssigneeProps) => {
  const { t } = useTranslation();
  const assigneeQuery = useFetchUserQuery(assignee ?? '');
  const assigneeFullName = getFullName(assigneeQuery.data?.givenName, assigneeQuery.data?.familyName);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem', mb: '0.5rem' }}>
      <Avatar username={assignee ?? ''} />
      <Typography>{assignee ? assigneeFullName : t('my_page.messages.pending_curator')}</Typography>
    </Box>
  );
};
