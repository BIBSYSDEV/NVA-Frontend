import { LoadingButton } from '@mui/lab';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Tooltip } from '@mui/material';
import { Ticket } from '../../../types/publication_types/ticket.types';
import { fetchUser } from '../../../api/roleApi';
import { getFullName } from '../../../utils/user-helpers';
import { RootState } from '../../../redux/store';
import { updateTicket } from '../../../api/registrationApi';
import { setNotification } from '../../../redux/notificationSlice';
import { getContributorInitials } from '../../../utils/registration-helpers';
import { ticketColor } from '../../messages/components/TicketListItem';
import { StyledBaseContributorIndicator } from '../../registration/contributors_tab/ContributorIndicator';
import { UrlPathTemplate } from '../../../utils/urlPaths';

interface TicketAssigneeProps {
  ticket: Ticket;
  refetchTickets: () => void;
}

export const TicketAssignee = ({ ticket, refetchTickets }: TicketAssigneeProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((store: RootState) => store);

  const assigneeQuery = useQuery({
    enabled: !!ticket.assignee,
    queryKey: [ticket.assignee],
    queryFn: () => (ticket.assignee ? fetchUser(ticket.assignee) : undefined),
    meta: { errorMessage: t('feedback.error.get_person') },
  });
  const assigneeName = getFullName(assigneeQuery.data?.givenName, assigneeQuery.data?.familyName);
  const assigneeInitials = getContributorInitials(assigneeName);

  const ticketMutation = useMutation({
    mutationFn: user?.nvaUsername ? () => updateTicket(ticket.id, { assignee: user.nvaUsername }) : undefined,
    onSuccess: refetchTickets,
    onError: () => dispatch(setNotification({ message: t('feedback.error.update_ticket_assignee'), variant: 'error' })),
  });

  const canSetAssignee =
    window.location.pathname.startsWith(UrlPathTemplate.Tasks) && user?.isCurator && ticket.status === 'Pending';

  return (
    <Box sx={{ height: '1.75rem', display: 'flex', gap: '0.5rem', mb: '0.5rem' }}>
      <Tooltip title={`${t('my_page.roles.curator')}: ${ticket.assignee ? assigneeName : t('common.none')}`}>
        <StyledBaseContributorIndicator sx={{ bgcolor: ticketColor[ticket.type] }}>
          {ticket.assignee ? assigneeInitials : ''}
        </StyledBaseContributorIndicator>
      </Tooltip>
      {canSetAssignee && ticket.assignee !== user?.nvaUsername && (
        <LoadingButton
          variant="outlined"
          size="small"
          loading={ticketMutation.isLoading}
          onClick={() => ticketMutation.mutate()}>
          {t('registration.public_page.tasks_panel.assign_ticket')}
        </LoadingButton>
      )}
    </Box>
  );
};
