import { TFunction } from 'i18next';
import { AssociatedFile, FileType, UserUploadDetails } from '../../types/associatedArtifact.types';
import { LogAction, LogActionItem, LogEntry } from '../../types/log.types';
import { PublishingTicket } from '../../types/publication_types/ticket.types';
import { getOpenFiles } from '../registration-helpers';

export function generatePublishingRequestLogEntry(
  ticket: PublishingTicket,
  filesOnRegistration: AssociatedFile[],
  t: TFunction
): LogEntry[] | LogEntry | undefined {
  switch (ticket.status) {
    case 'Completed': {
      if (ticket.approvedFiles.length > 0) {
        const uploadedFilesEntry = generateFilesUploadedLogEntry(ticket, filesOnRegistration, t);
        const publishedFilesEntry = generateApprovedFilesLogEntry(ticket, filesOnRegistration, t);
        return [uploadedFilesEntry, publishedFilesEntry];
      }
      return generateMetadataUpdatedLogEntry(ticket, t);
    }
    case 'Closed': {
      const uploeadedFilesEntry = generateFilesUploadedLogEntry(ticket, filesOnRegistration, t);
      const rejectedFilesEntry = generateRejectedFilesLogEntry(ticket, filesOnRegistration, t);
      return [uploeadedFilesEntry, rejectedFilesEntry];
    }
    case 'New':
    case 'Pending': {
      return generateFilesUploadedLogEntry(ticket, filesOnRegistration, t);
    }
    case 'NotApplicable':
    default: {
      return undefined;
    }
  }
}

function generateApprovedFilesLogEntry(
  ticket: PublishingTicket,
  filesOnRegistration: AssociatedFile[],
  t: TFunction
): LogEntry {
  const openFilesItems: LogActionItem[] = getOpenFiles(filesOnRegistration)
    .filter((file) => ticket.approvedFiles.includes(file.identifier))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((file) => ({
      description: file.name,
      fileIcon: 'file',
    }));

  const archivedFilesItems: LogActionItem[] = filesOnRegistration
    .filter(
      (file) =>
        (file.type === FileType.UnpublishableFile || file.type === FileType.InternalFile) &&
        ticket.approvedFiles.includes(file.identifier)
    )
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((file) => ({
      description: file.name,
      fileIcon: 'archivedFile',
    }));

  const deletedFilesItems: LogActionItem[] = ticket.approvedFiles
    .filter((identifier) => !filesOnRegistration.some((file) => file.identifier === identifier))
    .map(() => ({
      description: t('log.unknown_filename'),
      fileIcon: 'deletedFile',
    }));

  return {
    type: 'PublishingRequest',
    title: t('log.titles.files_published', { count: ticket.approvedFiles.length }),
    modifiedDate: ticket.finalizedDate ?? '',
    actions: [
      {
        actor: ticket.finalizedBy ?? '',
        items: [...openFilesItems, ...archivedFilesItems, ...deletedFilesItems],
      },
    ],
  };
}

function generateMetadataUpdatedLogEntry(ticket: PublishingTicket, t: TFunction): LogEntry {
  return {
    type: 'PublishingRequest',
    title: t('log.titles.metadata_updated'),
    modifiedDate: ticket.modifiedDate,
    actions: [
      {
        actor: ticket.owner,
        items: [],
      },
    ],
  };
}

function generateRejectedFilesLogEntry(
  ticket: PublishingTicket,
  filesOnRegistration: AssociatedFile[],
  t: TFunction
): LogEntry {
  const rejectedFiles = filesOnRegistration.filter((file) => ticket.filesForApproval.includes(file.identifier));

  const rejectedFileItems: LogActionItem[] = rejectedFiles
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((file) => ({
      description: file.name,
      fileIcon: 'rejectedFile',
    }));

  return {
    type: 'PublishingRequest',
    title: t('log.titles.files_rejected', { count: ticket.filesForApproval.length }),
    modifiedDate: ticket.finalizedDate ?? '',
    actions: [
      {
        actor: ticket.finalizedBy ?? '',
        items: rejectedFileItems,
      },
    ],
  };
}

function generateFilesUploadedLogEntry(
  ticket: PublishingTicket,
  filesOnRegistration: AssociatedFile[],
  t: TFunction
): LogEntry {
  const fileIdentifiersOnTicket = [...ticket.filesForApproval, ...ticket.approvedFiles];
  const uploadedFiles = filesOnRegistration.filter((file) => fileIdentifiersOnTicket.includes(file.identifier));
  const filesByUser = groupFilesByUser(uploadedFiles);

  const logActions: LogAction[] = [];

  const deletedFilesItems: LogActionItem[] = fileIdentifiersOnTicket
    .filter((identifier) => !filesOnRegistration.some((file) => file.identifier === identifier))
    .map(() => ({
      description: t('log.unknown_filename'),
      fileIcon: 'deletedFile',
    }));

  if (deletedFilesItems.length > 0) {
    logActions.push({
      actor: ticket.owner,
      items: deletedFilesItems,
    });
  }

  filesByUser.forEach((files, username) => {
    logActions.push({
      actor: username,
      items: files.map((file) => ({
        description: file.name,
        date: file.uploadDetails?.uploadedDate ?? '',
        fileIcon: 'file',
      })),
    });
  });

  return {
    type: 'PublishingRequest',
    title: t('log.titles.files_uploaded', { count: fileIdentifiersOnTicket.length }),
    modifiedDate: ticket.createdDate,
    actions: logActions,
  };
}

function groupFilesByUser(files: AssociatedFile[]) {
  const map: Map<string, AssociatedFile[]> = new Map();

  const userUploadedFiles = files.filter((file) => file.uploadDetails?.type === 'UserUploadDetails');
  userUploadedFiles.forEach((item: AssociatedFile) => {
    const key = (item.uploadDetails as UserUploadDetails).uploadedBy;
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}
