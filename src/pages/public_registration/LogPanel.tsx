import { PublishingTicket, Ticket, TicketType } from '../../types/publication_types/ticket.types';
import { Box, Skeleton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { fetchOrganization } from '../../api/cristinApi';
import { fetchUser } from '../../api/roleApi';
import { Registration } from '../../types/registration.types';
import { getFullName } from '../../utils/user-helpers';
import { StyledStatusMessageBox } from '../messages/components/PublishingRequestMessagesColumn';

interface LogItem {
  modifiedDate: string;
  description: string;
  type: TicketType;
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

  const logs: LogItem[] = [];

  if (registration.publishedDate) {
    const registrationPublished: LogItem = {
      modifiedDate: registration.publishedDate,
      description: t('registration.status.PUBLISHED_METADATA'),
      type: 'PublishingRequest',
    };
    logs.push(registrationPublished);
  }

  if (registration.publishedDate && registration.publishedDate < registration.modifiedDate) {
    const registrationLastModified: LogItem = {
      modifiedDate: registration.modifiedDate,
      description: t('common.last_modified'),
      type: 'PublishingRequest',
    };
    logs.push(registrationLastModified);
  }

  tickets.forEach((ticket) => {
    switch (ticket.type) {
      case 'PublishingRequest': {
        const publishingTicket = ticket as PublishingTicket;
        if (ticket.status === 'Completed' && publishingTicket.approvedFiles.length > 0) {
          logs.push({
            modifiedDate: ticket.modifiedDate,
            description: t('my_page.messages.files_published', {
              count: publishingTicket.approvedFiles.length,
            }),
            type: 'PublishingRequest',
          });
        } else if (ticket.status === 'Closed') {
          logs.push({
            modifiedDate: ticket.modifiedDate,
            description: t('my_page.messages.files_rejected'),
            type: 'PublishingRequest',
          });
        }
        break;
      }
      case 'DoiRequest': {
        if (ticket.status === 'Completed') {
          logs.push({
            modifiedDate: ticket.modifiedDate,
            description: t('my_page.messages.doi_completed'),
            type: 'DoiRequest',
          });
        } else if (ticket.status === 'Closed') {
          logs.push({
            modifiedDate: ticket.modifiedDate,
            description: t('my_page.messages.doi_closed'),
            type: 'DoiRequest',
          });
        }
        break;
      }
      default: {
        break;
      }
    }
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
        .sort((a, b) => new Date(a.modifiedDate).getTime() - new Date(b.modifiedDate).getTime())
        .map((logItem, index) => {
          const bgColor = logItem.type === 'PublishingRequest' ? 'publishingRequest.main' : 'doiRequest.main';
          return (
            <StyledStatusMessageBox key={index} sx={{ bgcolor: `${bgColor}` }}>
              <Typography>{logItem.description}</Typography>
              <Typography>{new Date(logItem.modifiedDate).toLocaleDateString()}</Typography>
            </StyledStatusMessageBox>
          );
        })}
    </Box>
  );
};
