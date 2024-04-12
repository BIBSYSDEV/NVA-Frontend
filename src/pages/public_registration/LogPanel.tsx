import { PublishingTicket, Ticket, TicketStatus, TicketType } from '../../types/publication_types/ticket.types';
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

const ticketStatusesToShow: TicketStatus[] = ['Completed', 'Closed'];
const ticketTypesToShow: TicketType[] = ['PublishingRequest', 'DoiRequest'];

type LogList = (Ticket | NonTicketLogEntry)[];

interface NonTicketLogEntry {
  modifiedDate: string;
  description: string;
}

function isTicket(object: any): object is Ticket {
  return ('type' as TicketType) in object;
}

function isNonTicketLogEntry(object: any): object is NonTicketLogEntry {
  return 'description' in object;
}

interface LogPanelProps {
  tickets: Ticket[];
  registration: Registration;
}

export const LogPanel = ({ tickets, registration }: LogPanelProps) => {
  const { t } = useTranslation();
  const resourceOwnerAffiliationId = registration.resourceOwner.ownerAffiliation;
  const resourceOwnerId = registration.resourceOwner.owner;

  const organizationQuery = useQuery({
    enabled: !!resourceOwnerAffiliationId,
    queryKey: ['organization', resourceOwnerAffiliationId],
    queryFn: resourceOwnerAffiliationId ? () => fetchOrganization(resourceOwnerAffiliationId) : undefined,
    meta: { errorMessage: t('feedback.error.get_institution') },
    staleTime: Infinity,
    cacheTime: 1_800_000, // 30 minutes
  });

  const userQuery = useQuery({
    enabled: !!resourceOwnerId,
    queryKey: ['user', resourceOwnerId],
    queryFn: resourceOwnerId ? () => fetchUser(resourceOwnerId) : undefined,
    retry: 0,
    staleTime: Infinity,
    cacheTime: 1_800_000, // 30 minutes
  });

  const logs: LogList = [...tickets];

  if (registration.publishedDate) {
    const registrationPublished: NonTicketLogEntry = {
      modifiedDate: registration.publishedDate,
      description: t('registration.status.PUBLISHED_METADATA'),
    };
    logs.push(registrationPublished);
  }

  if (registration.publishedDate && registration.publishedDate < registration.modifiedDate) {
    const registrationLastModified: NonTicketLogEntry = {
      modifiedDate: registration.modifiedDate,
      description: t('common.last_modified'),
    };
    logs.push(registrationLastModified);
  }

  const closedPublishingRequests = tickets.filter(
    (ticket) => ticket.type === 'PublishingRequest' && ticket.status === 'Closed'
  );
  closedPublishingRequests.forEach((ticket) => {
    const fileRejected: NonTicketLogEntry = {
      modifiedDate: ticket.modifiedDate,
      description: t('my_page.messages.files_rejected'),
    };
    logs.push(fileRejected);
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', mt: '0.5rem' }}>
      {registration && (
        <StyledStatusMessageBox sx={{ bgcolor: 'publishingRequest.main' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography>{t('common.created')}:</Typography>
            {organizationQuery.isLoading || userQuery.isLoading ? (
              <Skeleton sx={{ width: '4rem' }} />
            ) : (
              <Typography>
                {organizationQuery.data ? organizationQuery.data?.acronym : t('common.unknown')}
                {userQuery.data ? `, ${getFullName(userQuery.data.givenName, userQuery.data.familyName)}` : ''}
              </Typography>
            )}
          </Box>
          <Typography>{new Date(registration.createdDate).toLocaleDateString()}</Typography>
        </StyledStatusMessageBox>
      )}
      {logs
        .filter(
          (logEntry) =>
            isNonTicketLogEntry(logEntry) ||
            (isTicket(logEntry) &&
              ticketStatusesToShow.includes(logEntry.status) &&
              ticketTypesToShow.includes(logEntry.type))
        )
        .sort((a, b) => new Date(a.modifiedDate).getTime() - new Date(b.modifiedDate).getTime())
        .map((logEntry) => {
          if (isTicket(logEntry) && logEntry.type === 'PublishingRequest') {
            return <CompletedPublishingRequestStatusBox key={logEntry.id} ticket={logEntry as PublishingTicket} />;
          }
          if (isTicket(logEntry) && logEntry.type === 'DoiRequest') {
            return <DoiRequestMessagesColumn key={logEntry.id} ticket={logEntry} />;
          }
          if (isNonTicketLogEntry(logEntry)) {
            return (
              <StyledStatusMessageBox sx={{ bgcolor: 'publishingRequest.main' }}>
                <Typography>{logEntry.description}</Typography>
                <Typography>{new Date(logEntry.modifiedDate).toLocaleDateString()}</Typography>
              </StyledStatusMessageBox>
            );
          }
          return null;
        })}
    </Box>
  );
};
