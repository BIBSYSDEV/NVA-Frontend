import { TFunction } from 'i18next';
import { AssociatedFile, FileType } from '../../types/associatedArtifact.types';
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
        const openFilesEntry = generateOpenFilesLogEntry(ticket, filesOnRegistration, t);
        const internalFilesEntry = generateInternalFilesLogEntry(ticket, filesOnRegistration, t);
        return [uploadedFilesEntry, openFilesEntry, internalFilesEntry].filter(Boolean) as LogEntry[];
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

const fileHasBeenChangedToHidden = (file: AssociatedFile, filesOnRegistration: AssociatedFile[]) =>
  filesOnRegistration.some(
    (registrationFile) =>
      registrationFile.identifier === file.identifier && registrationFile.type === FileType.HiddenFile
  );

const generateInternalFilesLogEntry = (
  ticket: PublishingTicket,
  filesOnRegistration: AssociatedFile[],
  t: TFunction
): LogEntry | null => {
  const internalFilesItems: LogActionItem[] = ticket.approvedFiles
    .filter((file) => file.type === FileType.InternalFile)
    .sort((a, b) => a.name?.localeCompare(b.name))
    .map((file) => ({
      description: file.name,
      fileIcon: fileHasBeenRemovedFromRegistration(file, filesOnRegistration) ? 'deletedFile' : 'archivedFile',
    }));

  if (internalFilesItems.length === 0) {
    return null;
  }

  return {
    type: 'PublishingRequest',
    title: t('log.titles.file_archived', { count: internalFilesItems.length }),
    modifiedDate: ticket.finalizedDate ?? '',
    actions: [
      {
        actor: ticket.finalizedBy ?? '',
        items: internalFilesItems,
      },
    ],
  };
};

function generateOpenFilesLogEntry(
  ticket: PublishingTicket,
  filesOnRegistration: AssociatedFile[],
  t: TFunction
): LogEntry | null {
  const openFilesItems: LogActionItem[] = ticket.approvedFiles
    .filter(isOpenFile)
    .sort((a, b) => a.name?.localeCompare(b.name))
    .map((file) => ({
      description: file.name,
      fileIcon: fileHasBeenRemovedFromRegistration(file, filesOnRegistration)
        ? 'deletedFile'
        : fileHasBeenChangedToHidden(file, filesOnRegistration)
          ? 'hiddenFile'
          : 'file',
    }));

  if (openFilesItems.length === 0) {
    return null;
  }

  return {
    type: 'PublishingRequest',
    title: t('log.titles.files_published', { count: openFilesItems.length }),
    modifiedDate: ticket.finalizedDate ?? '',
    actions: [
      {
        actor: ticket.finalizedBy ?? '',
        items: openFilesItems,
      },
    ],
    messages: ticket.messages,
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
    .sort((a, b) => a.name?.localeCompare(b.name))
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
    messages: ticket.messages,
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
        fileIcon: fileHasBeenRemovedFromRegistration(file, filesOnRegistration)
          ? 'deletedFile'
          : file.type === FileType.InternalFile
            ? 'archivedFile'
            : 'file',
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

  files.forEach((file) => {
    const key = file.uploadDetails?.type === 'UserUploadDetails' ? file.uploadDetails.uploadedBy : 'unknown';
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [file]);
    } else {
      collection.push(file);
    }
  });
  return map;
}
