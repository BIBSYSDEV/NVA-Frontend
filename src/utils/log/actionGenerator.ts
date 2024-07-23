import { TFunction } from 'i18next';
import { getPublishedFiles, getUnpublishableFiles } from '../registration-helpers';
import { AssociatedFile } from '../../types/associatedArtifact.types';
import { LogAction, LogActionItem } from '../../types/log.types';
import { PublishingTicket, Ticket } from '../../types/publication_types/ticket.types';

export function generateActionsFromTicket(
  ticket: Ticket,
  filesOnRegistration: AssociatedFile[],
  t: TFunction
): LogAction[] {
  switch (ticket.type) {
    case 'PublishingRequest': {
      return generateActionsFromPublishingTicket(ticket as PublishingTicket, filesOnRegistration, t);
    }
    case 'DoiRequest': {
      return generateActionsFromDoiTicket(ticket);
    }
    case 'GeneralSupportCase':
    default: {
      return [];
    }
  }
}

function generateActionsFromDoiTicket(ticket: Ticket): LogAction[] {
  if (ticket.status === 'Completed') {
    return [generateActionWithoutItems(ticket.finalizedBy ?? '')];
  }

  if (ticket.status === 'Closed') {
    return [generateActionWithoutItems(ticket.finalizedBy ?? '')];
  }

  if (ticket.status === 'New' || ticket.status === 'Pending') {
    return [generateActionWithoutItems(ticket.owner ?? '')];
  }

  return [];
}

function generateActionsFromPublishingTicket(
  ticket: PublishingTicket,
  filesOnRegistration: AssociatedFile[],
  t: TFunction
): LogAction[] {
  if (ticket.status === 'Completed') {
    if (ticket.approvedFiles.length > 0) {
      return generateActionsForApprovedFiles(ticket, filesOnRegistration, t);
    }

    return [generateActionWithoutItems('')];
  }

  if (ticket.status === 'Closed') {
    return generateActionForRejectedFiles(ticket, filesOnRegistration);
  }

  if (ticket.status === 'New' || ticket.status === 'Pending') {
    return generateActionsForUploadedFiles(ticket, filesOnRegistration);
  }

  return [];
}

function generateActionsForApprovedFiles(
  ticket: PublishingTicket,
  filesOnRegistration: AssociatedFile[],
  t: TFunction
): LogAction[] {
  const publishedFilesItems: LogActionItem[] = getPublishedFiles(filesOnRegistration)
    .filter((file) => ticket.approvedFiles.includes(file.identifier))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((file) => {
      return {
        description: file.name,
        icon: 'file',
      };
    });

  const archivedFilesItems: LogActionItem[] = getUnpublishableFiles(filesOnRegistration)
    .filter((file) => ticket.approvedFiles.includes(file.identifier))
    .map((file) => {
      return {
        description: file.name,
        icon: 'archivedFile',
      };
    });

  const deletedFilesItems: LogActionItem[] = ticket.approvedFiles
    .filter((identifier) => !filesOnRegistration.some((file) => file.identifier === identifier))
    .map(() => {
      return {
        description: t('log.unknown_filename'),
        icon: 'deletedFile',
      };
    });

  return [
    {
      actor: ticket.finalizedBy ?? '',
      items: [...publishedFilesItems, ...archivedFilesItems, ...deletedFilesItems],
    },
  ];
}

function generateActionForRejectedFiles(ticket: PublishingTicket, filesOnRegistration: AssociatedFile[]): LogAction[] {
  const rejectedFiles = filesOnRegistration.filter((file) => ticket.filesForApproval.includes(file.identifier));

  const rejectedFileItems: LogActionItem[] = rejectedFiles.map((file) => {
    return {
      description: file.name,
      icon: 'rejectedFile',
    };
  });

  return [
    {
      actor: ticket.finalizedBy ?? '',
      items: rejectedFileItems,
    },
  ];
}

function generateActionsForUploadedFiles(ticket: PublishingTicket, filesOnRegistration: AssociatedFile[]): LogAction[] {
  const filesForApproval = filesOnRegistration.filter((file) => ticket.filesForApproval.includes(file.identifier));
  const filesByUser = groupFilesByUser(filesForApproval);

  const logActions: LogAction[] = [];

  filesByUser.forEach((files: AssociatedFile[], user: string) => {
    const logActionItems: LogActionItem[] = [];
    files.forEach((file) => {
      logActionItems.push({
        description: file.name,
        date: file.uploadDetails?.uploadedDate ?? '',
        icon: 'file',
      });
    });
    logActions.push({
      actor: user,
      items: logActionItems,
    });
  });

  return logActions;
}

function groupFilesByUser(files: AssociatedFile[]) {
  const map: Map<string, AssociatedFile[]> = new Map();
  files.forEach((item: AssociatedFile) => {
    const key = item.uploadDetails?.uploadedBy ?? '';
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

function generateActionWithoutItems(actor: string): LogAction {
  return {
    actor: actor,
    items: [],
  };
}
