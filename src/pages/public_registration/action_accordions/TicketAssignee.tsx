import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { updateTicket } from '../../../api/registrationApi';
import { AssigneeSelector } from '../../../components/AssigneeSelector';
import { setNotification } from '../../../redux/notificationSlice';
import { RootState } from '../../../redux/store';
import { Ticket } from '../../../types/publication_types/ticket.types';
import { RoleName } from '../../../types/user.types';
import { UrlPathTemplate } from '../../../utils/urlPaths';

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
    onSuccess: async () => {
      dispatch(setNotification({ message: t('feedback.success.update_ticket_assignee'), variant: 'success' }));
    },
    onError: () => dispatch(setNotification({ message: t('feedback.error.update_ticket_assignee'), variant: 'error' })),
  });

  const canSetAssignee =
    window.location.pathname.startsWith(UrlPathTemplate.TasksDialogue) &&
    canEditTicket &&
    (ticket.status === 'Pending' || ticket.status === 'New');

  return (
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
  );
};
