import { TFunction } from 'i18next';
import { AssociatedFile, UserUploadDetails } from '../../types/associatedArtifact.types';
import { LogAction, LogActionItem, LogEntry } from '../../types/log.types';
import { PublishingTicket } from '../../types/publication_types/ticket.types';
import { getPublishedFiles, getUnpublishableFiles } from '../registration-helpers';

export function generatePublishingRequestLogEntry(
  ticket: PublishingTicket,
  filesOnRegistration: AssociatedFile[],
  t: TFunction
): LogEntry | undefined {
  switch (ticket.status) {
    case 'Completed': {
      if (ticket.approvedFiles.length > 0) {
        return generatePublishedFilesLogEntry(ticket, filesOnRegistration, t);
      }
      return generateMetadataUpdatedLogEntry(ticket, t);
    }
    case 'Closed': {
      return generateRejectedFilesLogEntry(ticket, filesOnRegistration, t);
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

function generatePublishedFilesLogEntry(
  ticket: PublishingTicket,
  filesOnRegistration: AssociatedFile[],
  t: TFunction
): LogEntry {
  const publishedFilesItems: LogActionItem[] = getPublishedFiles(filesOnRegistration)
    .filter((file) => ticket.approvedFiles.includes(file.identifier))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((file) => {
      return {
        description: file.name,
        fileIcon: 'file',
      };
    });

  const archivedFilesItems: LogActionItem[] = getUnpublishableFiles(filesOnRegistration)
    .filter((file) => ticket.approvedFiles.includes(file.identifier))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((file) => {
      return {
        description: file.name,
        fileIcon: 'archivedFile',
      };
    });

  const deletedFilesItems: LogActionItem[] = ticket.approvedFiles
    .filter((identifier) => !filesOnRegistration.some((file) => file.identifier === identifier))
    .map(() => {
      return {
        description: t('log.unknown_filename'),
        fileIcon: 'deletedFile',
      };
    });

  return {
    type: 'PublishingRequest',
    title: t('log.titles.files_published', { count: ticket.approvedFiles.length }),
    modifiedDate: ticket.finalizedDate ?? '',
    actions: [
      {
        actor: ticket.finalizedBy ?? '',
        items: [...publishedFilesItems, ...archivedFilesItems, ...deletedFilesItems],
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
    .map((file) => {
      return {
        description: file.name,
        fileIcon: 'rejectedFile',
      };
    });

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
  const filesForApproval = filesOnRegistration.filter((file) => ticket.filesForApproval.includes(file.identifier));
  const filesByUser = groupFilesByUser(filesForApproval);

  const logActions: LogAction[] = [];

  filesByUser.forEach((files: AssociatedFile[], user: string) => {
    const logActionItems: LogActionItem[] = [];
    files.forEach((file) => {
      logActionItems.push({
        description: file.name,
        date: file.uploadDetails?.uploadedDate ?? '',
        fileIcon: 'file',
      });
    });
    logActions.push({
      actor: user,
      items: logActionItems,
    });
  });

  return {
    type: 'PublishingRequest',
    title: t('log.titles.files_uploaded', { count: ticket.filesForApproval.length }),
    modifiedDate: ticket.createdDate,
    actions: logActions,
  };
}

function groupFilesByUser(files: AssociatedFile[]) {
  const map: Map<string, AssociatedFile[]> = new Map();

  const filteredFiles = files.filter((file) => file.uploadDetails?.type === 'UserUploadDetails');
  filteredFiles.forEach((item: AssociatedFile) => {
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
