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
import { ticketColor } from '../../messages/components/TicketListItem';

interface TicketAssigneeProps {
  ticket: Ticket;
  refetchTickets: () => void;
}

export const TicketAssignee = ({ ticket, refetchTickets }: TicketAssigneeProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((store: RootState) => store.user);

  const ticketMutation = useMutation({
    mutationFn: async (assigneeUsername: string) => await updateTicket(ticket.id, { assignee: assigneeUsername }),
    onSuccess: () => {
      refetchTickets();
      dispatch(setNotification({ message: t('feedback.success.update_ticket_assignee'), variant: 'success' }));
    },
    onError: () => dispatch(setNotification({ message: t('feedback.error.update_ticket_assignee'), variant: 'error' })),
  });

  const canSetAssignee =
    window.location.pathname.startsWith(UrlPathTemplate.TasksDialogue) &&
    !!user?.isCurator &&
    (ticket.status === 'Pending' || ticket.status === 'New');

  return (
    <AssigneeSelector
      assignee={ticket.assignee}
      canSetAssignee={canSetAssignee}
      onSelectAssignee={async (assignee) => {
        await ticketMutation.mutateAsync(assignee);
      }}
      isUpdating={ticketMutation.isLoading}
      roleFilter={RoleName.Curator}
      iconBackgroundColor={ticketColor[ticket.type]}
    />
  );
};
