import { TFunction } from 'i18next';
import { AssociatedFile, FileType, UserUploadDetails } from '../../types/associatedArtifact.types';
import { LogAction, LogActionItem, LogEntry } from '../../types/log.types';
import { PublishingTicket } from '../../types/publication_types/ticket.types';
import { isOpenFile } from '../registration-helpers';

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
        return [uploadedFilesEntry, publishedFilesEntry].filter(Boolean);
      }
      return generateMetadataUpdatedLogEntry(ticket, t);
    }
    case 'Closed': {
      const uploadedFilesEntry = generateFilesUploadedLogEntry(ticket, filesOnRegistration, t);
      const rejectedFilesEntry = generateRejectedFilesLogEntry(ticket, filesOnRegistration, t);
      return [uploadedFilesEntry, rejectedFilesEntry].filter(Boolean);
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

const fileHasBeenRemovedFromRegistration = (file: AssociatedFile, filesOnRegistration: AssociatedFile[]) =>
  !filesOnRegistration.some((registrationFile) => registrationFile.identifier === file.identifier);

function generateApprovedFilesLogEntry(
  ticket: PublishingTicket,
  filesOnRegistration: AssociatedFile[],
  t: TFunction
): LogEntry {
  const openFilesItems: LogActionItem[] = ticket.approvedFiles
    .filter(isOpenFile)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((file) => ({
      description: file.name,
      fileIcon: fileHasBeenRemovedFromRegistration(file, filesOnRegistration) ? 'deletedFile' : 'file',
    }));

  const archivedFilesItems: LogActionItem[] = ticket.approvedFiles
    .filter((file) => file.type === FileType.InternalFile)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((file) => ({
      description: file.name,
      fileIcon: fileHasBeenRemovedFromRegistration(file, filesOnRegistration) ? 'deletedFile' : 'archivedFile',
    }));

  return {
    type: 'PublishingRequest',
    title: t('log.titles.files_published', { count: ticket.approvedFiles.length }),
    modifiedDate: ticket.finalizedDate ?? '',
    actions: [
      {
        actor: ticket.finalizedBy ?? '',
        items: [...openFilesItems, ...archivedFilesItems],
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
  const rejectedFileItems: LogActionItem[] = ticket.filesForApproval
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((file) => ({
      description: file.name,
      fileIcon: fileHasBeenRemovedFromRegistration(file, filesOnRegistration) ? 'deletedFile' : 'rejectedFile',
    }));

  return {
    type: 'PublishingRequest',
    title: t('log.titles.files_rejected', { count: rejectedFileItems.length }),
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
  const uploadedFiles = [...ticket.filesForApproval, ...ticket.approvedFiles];
  const filesByUser = groupFilesByUser(uploadedFiles);

  const logActions: LogAction[] = [];

  filesByUser.forEach((files, username) => {
    logActions.push({
      actor: username,
      items: files.map((file) => ({
        description: file.name,
        date: file.uploadDetails?.uploadedDate ?? '',
        fileIcon: fileHasBeenRemovedFromRegistration(file, filesOnRegistration) ? 'deletedFile' : 'file',
      })),
    });
  });

  return {
    type: 'PublishingRequest',
    title: t('log.titles.files_uploaded', { count: uploadedFiles.length }),
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
