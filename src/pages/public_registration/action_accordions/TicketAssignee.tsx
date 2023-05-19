import { LoadingButton } from '@mui/lab';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Paper, Typography, Skeleton } from '@mui/material';
import { Ticket } from '../../../types/publication_types/ticket.types';
import { fetchUser } from '../../../api/roleApi';
import { setNotification } from '../../../redux/notificationSlice';
import { getFullName } from '../../../utils/user-helpers';
import { RootState } from '../../../redux/store';
import { UpdateTicketData, updateTicket } from '../../../api/registrationApi';

interface TicketAssigneeProps {
  ticket: Ticket;
  refetchRegistrationAndTickets: () => void;
}

export const TicketAssignee = ({ ticket, refetchRegistrationAndTickets }: TicketAssigneeProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((store: RootState) => store);

  const assigneeQuery = useQuery({
    enabled: !!ticket.assignee,
    queryKey: [ticket.assignee],
    queryFn: () => (ticket.assignee ? fetchUser(ticket.assignee) : undefined),
    onError: () => dispatch(setNotification({ message: t('feedback.error.get_person'), variant: 'error' })),
  });
  const assigneeName = getFullName(assigneeQuery.data?.givenName, assigneeQuery.data?.familyName);

  const ticketMutation = useMutation({
    mutationFn: (newTicketData: UpdateTicketData) => updateTicket(ticket.id, newTicketData),
    onSuccess: refetchRegistrationAndTickets,
    onError: () => dispatch(setNotification({ message: t('feedback.error.update_ticket_assignee'), variant: 'error' })),
  });

  return (
    <Paper
      sx={{ p: '0.5rem 1rem', mb: '1rem', width: 'fit-content', display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Typography sx={{ display: 'flex', gap: '0.25rem', fontWeight: 700 }}>
        <span>{t('common.assignee')}:</span>
        {ticket.assignee ? (
          assigneeQuery.isLoading ? (
            <Skeleton sx={{ width: '8rem' }} />
          ) : (
            assigneeName
          )
        ) : (
          <i>{t('common.none')}</i>
        )}
      </Typography>
      {ticket.status === 'Pending' && user && ticket.assignee !== user?.nvaUsername && (
        <LoadingButton
          variant="outlined"
          size="small"
          loading={ticketMutation.isLoading}
          onClick={() => ticketMutation.mutate({ assignee: user.nvaUsername })}>
          {t('registration.public_page.tasks_panel.assign_ticket')}
        </LoadingButton>
      )}
    </Paper>
  );
};
