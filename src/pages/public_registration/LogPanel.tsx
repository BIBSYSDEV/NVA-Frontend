import { Box, Tooltip, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchOrganization } from '../../api/cristinApi';
import { Avatar } from '../../components/Avatar';
import { AssociatedFile, FileType } from '../../types/associatedArtifact.types';
import { PublishingTicket, Ticket, TicketType } from '../../types/publication_types/ticket.types';
import { Registration } from '../../types/registration.types';
import { toDateString } from '../../utils/date-helpers';
import { getAssociatedFiles } from '../../utils/registration-helpers';
import { StyledStatusMessageBox } from '../messages/components/PublishingRequestMessagesColumn';
import { ticketColor } from '../messages/components/TicketListItem';

interface LogItem {
  modifiedDate: string;
  title: string;
  description?: string;
  filesInfo?: TicketFilesInfo;
  type: TicketType;
  actionBy?: string[];
}

interface LogPanelProps {
  tickets: Ticket[];
  registration: Registration;
}

export const LogPanel = ({ tickets, registration }: LogPanelProps) => {
  const { t } = useTranslation();

  const isImported = !!registration.importDetails?.length;

  const resourceOwnerAffiliationId = registration.resourceOwner.ownerAffiliation;
  const resourceOwnerId = registration.resourceOwner.owner;

  const registrationFiles = getAssociatedFiles(registration.associatedArtifacts);
  const numberOfArchivedFilesOnRegistration = registrationFiles.filter(
    (file) => file.type === FileType.UnpublishableFile
  ).length;

  const organizationQuery = useQuery({
    enabled: !!resourceOwnerAffiliationId,
    queryKey: ['organization', resourceOwnerAffiliationId],
    queryFn: resourceOwnerAffiliationId ? () => fetchOrganization(resourceOwnerAffiliationId) : undefined,
    meta: { errorMessage: t('feedback.error.get_institution') },
    staleTime: Infinity,
    gcTime: 1_800_000, // 30 minutes
  });
  const organizationAcronym = organizationQuery.isPending
    ? ''
    : organizationQuery.data
      ? organizationQuery.data?.acronym
      : t('common.unknown');

  const logs: LogItem[] = [];

  if (registration.createdDate) {
    const registrationCreated: LogItem = {
      modifiedDate: registration.createdDate,
      title: t('my_page.messages.created_in_nva'),
      description: organizationAcronym,
      type: 'PublishingRequest',
      actionBy: [resourceOwnerId],
    };
    logs.push(registrationCreated);
  }

  if (isImported) {
    registration.importDetails?.forEach((importDetail) => {
      const registrationImported: LogItem = {
        modifiedDate: importDetail.importDate,
        title: importDetail.importSource.archive
          ? t('my_page.messages.imported_from_source_and_archive', {
              source: importDetail.importSource.source,
              archive: importDetail.importSource.archive,
            })
          : t('my_page.messages.imported_from_source', {
              source: importDetail.importSource.source,
            }),
        description: organizationAcronym,
        type: 'PublishingRequest',
      };
      logs.push(registrationImported);
    });
  }

  if (registration.publishedDate && registration.publishedDate >= registration.createdDate) {
    const registrationPublished: LogItem = {
      modifiedDate: registration.publishedDate,
      title: t('my_page.messages.metadata_published_in_nva'),
      type: 'PublishingRequest',
    };
    logs.push(registrationPublished);
  }

  if (registration.publishedDate && registration.publishedDate < registration.modifiedDate) {
    const registrationLastModified: LogItem = {
      modifiedDate: registration.modifiedDate,
      title: t('common.last_modified'),
      type: 'PublishingRequest',
    };
    logs.push(registrationLastModified);
  }

  tickets.forEach((ticket) => {
    switch (ticket.type) {
      case 'PublishingRequest': {
        const publishingTicket = ticket as PublishingTicket;
        const filesInfo = getTicketFilesInfo(publishingTicket, registrationFiles);
        if (ticket.status === 'Completed' && publishingTicket.approvedFiles.length > 0) {
          logs.push({
            modifiedDate: ticket.modifiedDate,
            title: t('my_page.messages.files_published', {
              count: publishingTicket.approvedFiles.length,
            }),
            filesInfo: filesInfo,
            type: 'PublishingRequest',
            actionBy: ticket.finalizedBy ? [ticket.finalizedBy] : [],
          });
        } else if (ticket.status === 'Closed') {
          logs.push({
            modifiedDate: ticket.modifiedDate,
            title: t('my_page.messages.files_rejected'),
            type: 'PublishingRequest',
            actionBy: ticket.finalizedBy ? [ticket.finalizedBy] : [],
          });
        } else if (ticket.status === 'Pending' || ticket.status === 'New') {
          logs.push({
            modifiedDate: ticket.modifiedDate,
            title: t('my_page.messages.files_uploaded', {
              count: publishingTicket.filesForApproval.length,
            }),
            filesInfo: filesInfo,
            type: 'PublishingRequest',
            actionBy: getUploadedBy(publishingTicket, registrationFiles),
          });
        }
        break;
      }
      case 'DoiRequest': {
        if (ticket.status === 'Completed') {
          logs.push({
            modifiedDate: ticket.modifiedDate,
            title: t('my_page.messages.doi_completed'),
            type: 'DoiRequest',
            actionBy: ticket.finalizedBy ? [ticket.finalizedBy] : [],
          });
        } else if (ticket.status === 'Closed') {
          logs.push({
            modifiedDate: ticket.modifiedDate,
            title: t('my_page.messages.doi_closed'),
            type: 'DoiRequest',
            actionBy: ticket.finalizedBy ? [ticket.finalizedBy] : [],
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
      {logs
        .sort((a, b) => new Date(a.modifiedDate).getTime() - new Date(b.modifiedDate).getTime())
        .map((logItem, index) => {
          const modifiedDate = new Date(logItem.modifiedDate);
          return (
            <StyledStatusMessageBox key={index} sx={{ bgcolor: ticketColor[logItem.type] }}>
              <Typography>{logItem.title}</Typography>
              <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                <Tooltip title={modifiedDate.toLocaleTimeString()}>
                  <Typography>{toDateString(modifiedDate)}</Typography>
                </Tooltip>
                {logItem.actionBy && logItem.actionBy.map((username) => <Avatar key={username} username={username} />)}
              </Box>
              {logItem.description && <Typography>{logItem.description}</Typography>}
              {logItem.filesInfo?.approvedFilenames && logItem.filesInfo.approvedFilenames.length > 0 && (
                <FilenamesList filenames={logItem.filesInfo?.approvedFilenames} />
              )}
              {logItem.filesInfo?.filenamesForApproval && logItem.filesInfo.filenamesForApproval.length > 0 && (
                <FilenamesList filenames={logItem.filesInfo?.filenamesForApproval} />
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

interface FilenamesProps {
  filenames: string[];
}

const FilenamesList = ({ filenames }: FilenamesProps) => {
  return (
    <Box
      component="ul"
      sx={{
        gridColumn: '1/3',
        m: '0',
        p: 'inherit',
        color: 'black',
      }}>
      {filenames.map((filename, index) => (
        <li key={`${filename}-${index}`}>
          <Tooltip title={filename}>
            <Typography
              sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                width: 'fit-content',
                maxWidth: '100%',
              }}>
              {filename}
            </Typography>
          </Tooltip>
        </li>
      ))}
    </Box>
  );
};

interface TicketFilesInfo {
  approvedFilenames: string[];
  filenamesForApproval: string[];
  numberOfUnpublishableFiles: number;
  numberOfDeletedFiles: number;
}

function getTicketFilesInfo(ticket: PublishingTicket, registrationFiles: AssociatedFile[]): TicketFilesInfo {
  const publishedFilesOnTicket = registrationFiles.filter(
    (file) => file.type === FileType.PublishedFile && ticket.approvedFiles.includes(file.identifier)
  );

  const filesForApprovalOnTicket = registrationFiles.filter((file) =>
    ticket.filesForApproval.includes(file.identifier)
  );

  const unpublishedFilesOnTicket = registrationFiles.filter(
    (file) => file.type === FileType.UnpublishableFile && ticket.approvedFiles.includes(file.identifier)
  );

  const deletedFilesOnTicket = ticket.approvedFiles.filter(
    (identifier) => !registrationFiles.some((file) => file.identifier === identifier)
  );

  return {
    approvedFilenames: publishedFilesOnTicket.map((file) => file.name),
    filenamesForApproval: filesForApprovalOnTicket.map((file) => file.name),
    numberOfUnpublishableFiles: unpublishedFilesOnTicket.length,
    numberOfDeletedFiles: deletedFilesOnTicket.length,
  };
}

function getUploadedBy(ticket: PublishingTicket, registrationFiles: AssociatedFile[]): string[] {
  const ticketFiles = registrationFiles.filter((file) => ticket.filesForApproval.includes(file.identifier));
  const usernames = ticketFiles
    .flatMap((file) => (file.uploadDetails ? [file.uploadDetails] : []))
    .map((details) => details.uploadedBy);
  return [...new Set(usernames)];
}
