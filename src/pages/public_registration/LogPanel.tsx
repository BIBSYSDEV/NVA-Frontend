import { Box, Skeleton, Tooltip, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchOrganization } from '../../api/cristinApi';
import { fetchUser } from '../../api/roleApi';
import { PublishingTicket, Ticket, TicketType } from '../../types/publication_types/ticket.types';
import { Registration } from '../../types/registration.types';
import { getAssociatedFiles } from '../../utils/registration-helpers';
import { getFullName } from '../../utils/user-helpers';
import { StyledStatusMessageBox } from '../messages/components/PublishingRequestMessagesColumn';
import { ticketColor } from '../messages/components/TicketListItem';
import { AssociatedFile } from '../../types/associatedArtifact.types';

interface LogItem {
  modifiedDate: string;
  description: string;
  filesInfo?: TicketFilesInfo;
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

  const registrationFiles = getAssociatedFiles(registration.associatedArtifacts);
  const numberOfArchivedFilesOnRegistration = registrationFiles.filter(
    (file) => file.type === 'UnpublishableFile'
  ).length;

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
            filesInfo: getTicketFilesInfo(publishingTicket, registrationFiles),
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
      {numberOfArchivedFilesOnRegistration > 0 && (
        <StyledStatusMessageBox sx={{ bgcolor: 'publishingRequest.main' }}>
          <Typography sx={{ gridColumn: '1/3', fontStyle: 'italic' }}>
            {t('log.archived_files_on_registration', { count: numberOfArchivedFilesOnRegistration })}
          </Typography>
        </StyledStatusMessageBox>
      )}
      {registration && (
        <StyledStatusMessageBox sx={{ bgcolor: 'publishingRequest.main' }}>
          <Typography>{t('common.created')}</Typography>
          <Tooltip title={new Date(registration.createdDate).toLocaleTimeString()} enterDelay={tooltipDelay}>
            <Typography>{new Date(registration.createdDate).toLocaleDateString()}</Typography>
          </Tooltip>
          {organizationQuery.isLoading || userQuery.isLoading ? (
            <Skeleton sx={{ width: '4rem' }} />
          ) : (
            <Typography>
              {organizationQuery.data ? organizationQuery.data?.acronym : t('common.unknown')}
              {userQuery.data ? `, ${getFullName(userQuery.data.givenName, userQuery.data.familyName)}` : ''}
            </Typography>
          )}
        </StyledStatusMessageBox>
      )}
      {logs
        .sort((a, b) => new Date(a.modifiedDate).getTime() - new Date(b.modifiedDate).getTime())
        .map((logItem, index) => {
          const modifiedDate = new Date(logItem.modifiedDate);
          return (
            <StyledStatusMessageBox key={index} sx={{ bgcolor: ticketColor[logItem.type] }}>
              <Typography>{logItem.description}</Typography>
              <Tooltip title={modifiedDate.toLocaleTimeString()} enterDelay={tooltipDelay}>
                <Typography>{modifiedDate.toLocaleDateString()}</Typography>
              </Tooltip>
              {logItem.filesInfo?.approvedFileNames && logItem.filesInfo.approvedFileNames.length > 0 && (
                <Box
                  component="ul"
                  sx={{
                    gridColumn: '1/3',
                    m: '0',
                    p: 'inherit',
                    color: 'black',
                  }}>
                  {logItem.filesInfo.approvedFileNames.map((fileName, index) => (
                    <li key={index}>
                      <Tooltip title={fileName} enterDelay={tooltipDelay}>
                        <Typography
                          sx={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            width: 'fit-content',
                            maxWidth: '100%',
                          }}>
                          {fileName}
                        </Typography>
                      </Tooltip>
                    </li>
                  ))}
                </Box>
              )}
              {logItem.filesInfo && logItem.filesInfo.numberOfUnpublishableFiles > 0 && (
                <Typography sx={{ gridColumn: '1/3', fontStyle: 'italic' }}>
                  {t('log.archived_file', { count: logItem.filesInfo.numberOfUnpublishableFiles })}
                </Typography>
              )}
              {logItem.filesInfo && logItem.filesInfo.numberOfDeletedFiles > 0 && (
                <Typography sx={{ gridColumn: '1/3', fontStyle: 'italic' }}>
                  {t('log.deleted_file', { count: logItem.filesInfo.numberOfDeletedFiles })}
                </Typography>
              )}
            </StyledStatusMessageBox>
          );
        })}
    </Box>
  );
};

interface TicketFilesInfo {
  approvedFileNames: string[];
  numberOfUnpublishableFiles: number;
  numberOfDeletedFiles: number;
}

function getTicketFilesInfo(ticket: PublishingTicket, registrationFiles: AssociatedFile[]): TicketFilesInfo {
  const publishedFilesOnTicket = registrationFiles.filter(
    (file) => file.type === 'PublishedFile' && ticket.approvedFiles.includes(file.identifier)
  );

  const unpublishedFilesOnTicket = registrationFiles.filter(
    (file) => file.type === 'UnpublishableFile' && ticket.approvedFiles.includes(file.identifier)
  );

  const deletedFilesOnTicket = ticket.approvedFiles.filter(
    (identifier) => !registrationFiles.some((file) => file.identifier === identifier)
  );

  return {
    approvedFileNames: publishedFilesOnTicket.map((file) => file.name),
    numberOfUnpublishableFiles: unpublishedFilesOnTicket.length,
    numberOfDeletedFiles: deletedFilesOnTicket.length,
  };
}
