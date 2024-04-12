import { PublishingTicket, Ticket, TicketStatus } from '../../types/publication_types/ticket.types';
import { Box, Skeleton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { fetchOrganization } from '../../api/cristinApi';
import { fetchUser } from '../../api/roleApi';
import { Registration } from '../../types/registration.types';
import { getFullName } from '../../utils/user-helpers';
import { DoiRequestMessagesColumn } from '../messages/components/DoiRequestMessagesColumn';
import { StyledStatusMessageBox } from '../messages/components/PublishingRequestMessagesColumn';
import { CompletedPublishingRequestStatusBox } from './action_accordions/CompletedPublishingRequestStatusBox';

interface LogPanelProps {
  tickets: Ticket[];
  registration: Registration;
}

export const LogPanel = ({ tickets, registration }: LogPanelProps) => {
  const { t } = useTranslation();
  const ticketStatusesToShow: TicketStatus[] = ['Completed', 'Closed'];
  const resourceOwnerAffiliationId = registration.resourceOwner.ownerAffiliation;
  const resourceOwnerId = registration.resourceOwner.owner;

  const organizationQuery = useQuery({
    enabled: !!resourceOwnerAffiliationId,
    queryKey: ['log', 'organization', resourceOwnerAffiliationId],
    queryFn: resourceOwnerAffiliationId ? () => fetchOrganization(resourceOwnerAffiliationId) : undefined,
    meta: { errorMessage: t('feedback.error.get_institution') },
    staleTime: Infinity,
    cacheTime: 1_800_000, // 30 minutes
  });

  const personQuery = useQuery({
    enabled: !!resourceOwnerId,
    queryKey: ['log', 'user', resourceOwnerId],
    queryFn: resourceOwnerId ? () => fetchUser(resourceOwnerId) : undefined,
    retry: 0,
    staleTime: Infinity,
    cacheTime: 1_800_000, // 30 minutes
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', mt: '0.5rem' }}>
      {registration && (
        <StyledStatusMessageBox sx={{ bgcolor: 'publishingRequest.main' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography>{t('common.created')}:</Typography>
            {organizationQuery.isLoading || personQuery.isLoading ? (
              <Skeleton sx={{ width: '4rem' }} />
            ) : (
              <Typography>
                {organizationQuery.data ? organizationQuery.data?.acronym : t('common.unknown')}
                {personQuery.data ? `, ${getFullName(personQuery.data.givenName, personQuery.data.familyName)}` : ''}
              </Typography>
            )}
          </Box>
          <Typography>{new Date(registration.createdDate).toLocaleDateString()}</Typography>
        </StyledStatusMessageBox>
      )}
      {registration.publishedDate && (
        <StyledStatusMessageBox sx={{ bgcolor: 'publishingRequest.main' }}>
          <Typography>{t('registration.status.PUBLISHED_METADATA')}</Typography>
          <Typography>{new Date(registration.publishedDate).toLocaleDateString()}</Typography>
        </StyledStatusMessageBox>
      )}
      {tickets
        .filter((ticket) => ticketStatusesToShow.includes(ticket.status))
        .sort((a, b) => +a.modifiedDate - +b.modifiedDate)
        .map((ticket) => {
          if (ticket.type === 'PublishingRequest') {
            return <CompletedPublishingRequestStatusBox key={ticket.id} ticket={ticket as PublishingTicket} />;
          }
          if (ticket.type === 'DoiRequest') {
            return <DoiRequestMessagesColumn key={ticket.id} ticket={ticket} />;
          }
          return null;
        })}
    </Box>
  );
};
