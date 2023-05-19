import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Paper, Typography, Skeleton } from '@mui/material';
import { Ticket } from '../../../types/publication_types/ticket.types';
import { fetchUser } from '../../../api/roleApi';
import { getFullName } from '../../../utils/user-helpers';

interface TicketAssigneeProps {
  ticket: Ticket;
}

export const TicketAssignee = ({ ticket }: TicketAssigneeProps) => {
  const { t } = useTranslation();

  const assigneeQuery = useQuery({
    enabled: !!ticket.assignee,
    queryKey: [ticket.assignee],
    queryFn: () => (ticket.assignee ? fetchUser(ticket.assignee) : undefined),
    meta: { errorMessage: t('feedback.error.get_person') },
  });
  const assigneeName = getFullName(assigneeQuery.data?.givenName, assigneeQuery.data?.familyName);

  return (
    <Paper sx={{ p: '0.5rem 1rem', mb: '1rem', width: 'fit-content' }}>
      <Typography sx={{ display: 'flex', gap: '0.25rem', fontWeight: 700 }}>
        <span>{t('common.assignee')}:</span>
        {ticket.assignee ? (
          assigneeQuery.isLoading ? (
            <Skeleton sx={{ width: '8rem' }} />
          ) : assigneeName ? (
            assigneeName
          ) : (
            <i>{t('common.unknown')}</i>
          )
        ) : (
          <i>{t('common.none')}</i>
        )}
      </Typography>
    </Paper>
  );
};
