import { Box, Skeleton, Tooltip, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { fetchOrganization } from '../../api/cristinApi';
import { fetchUser } from '../../api/roleApi';
import { PublishingTicket, Ticket, TicketType } from '../../types/publication_types/ticket.types';
import { Registration } from '../../types/registration.types';
import { getAssociatedFiles } from '../../utils/registration-helpers';
import { getFullName } from '../../utils/user-helpers';
import { StyledStatusMessageBox } from '../messages/components/PublishingRequestMessagesColumn';

interface LogItem {
  modifiedDate: string;
  description: string;
  descriptionAppendage?: string[];
  type: TicketType;
}

interface LogPanelProps {
  tickets: Ticket[];
  registration: Registration;
}

const tooltipDelay = 400;

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
            descriptionAppendage: getFileNamesForTicket(publishingTicket, registration, t),
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
          <Tooltip title={new Date(registration.createdDate).toLocaleTimeString()} enterDelay={tooltipDelay}>
            <Typography>{new Date(registration.createdDate).toLocaleDateString()}</Typography>
          </Tooltip>
        </StyledStatusMessageBox>
      )}
      {logs
        .sort((a, b) => new Date(a.modifiedDate).getTime() - new Date(b.modifiedDate).getTime())
        .map((logItem, index) => {
          const bgColor = logItem.type === 'PublishingRequest' ? 'publishingRequest.main' : 'doiRequest.main';
          const modifiedDate = new Date(logItem.modifiedDate);
          return (
            <StyledStatusMessageBox key={index} sx={{ bgcolor: `${bgColor}` }}>
              <Typography>{logItem.description}</Typography>
              <Tooltip title={modifiedDate.toLocaleTimeString()} enterDelay={tooltipDelay}>
                <Typography>{modifiedDate.toLocaleDateString()}</Typography>
              </Tooltip>
              {logItem.descriptionAppendage && logItem.descriptionAppendage?.length > 0 && (
                <Box
                  component="ul"
                  sx={{
                    gridColumn: '1/3',
                    m: '0',
                    p: 'inherit',
                    color: 'black',
                  }}>
                  {logItem.descriptionAppendage.map((desc, index) => (
                    <li key={index}>
                      <Tooltip title={desc === t('common.deleted') ? '' : desc} enterDelay={tooltipDelay}>
                        <Typography
                          sx={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}>
                          {desc}
                        </Typography>
                      </Tooltip>
                    </li>
                  ))}
                </Box>
              )}
            </StyledStatusMessageBox>
          );
        })}
    </Box>
  );
};

function getFileNamesForTicket(ticket: PublishingTicket, registration: Registration, t: TFunction<'translation'>) {
  return ticket.approvedFiles.map(
    (identifier) =>
      getAssociatedFiles(registration.associatedArtifacts).find((file) => file.identifier === identifier)?.name ??
      t('common.deleted')
  );
}
