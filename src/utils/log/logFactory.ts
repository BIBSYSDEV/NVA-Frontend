import BlockIcon from '@mui/icons-material/Block';
import CheckIcon from '@mui/icons-material/Check';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { TFunction } from 'i18next';
import { AssociatedFile, FileType } from '../../types/associatedArtifact.types';
import { PublishingTicket, Ticket } from '../../types/publication_types/ticket.types';
import { Registration } from '../../types/registration.types';
import { getAssociatedFiles, isOpenFile, isPendingOpenFile } from '../registration-helpers';

interface SimpleLogItemEntry {
  text: string;
  date?: string;
  bgcolor: string;
  Icon: typeof CheckIcon;
}

// Ignore file if it has been removed from result, has new type, or is handled by a newer ticket
const fileIsStillRelevant = (
  currentFiles: AssociatedFile[],
  file: AssociatedFile,
  allTickets: PublishingTicket[],
  ticket: PublishingTicket
) => {
  const matchingFileOnResult = currentFiles.find((thisFile) => thisFile.identifier === file.identifier);
  if (matchingFileOnResult?.type !== file.type) {
    return false;
  }

  const lastTicketWithThisFile = allTickets.findLast((thisTicket) =>
    [...thisTicket.filesForApproval, ...thisTicket.approvedFiles].some(
      (thisFile) => thisFile.identifier === file.identifier
    )
  );
  const isLastTicketWithThisFile = lastTicketWithThisFile?.id === ticket.id;
  if (!isLastTicketWithThisFile) {
    return false;
  }

  return true;
};

export const generateSimplePublishingLog = (registration: Registration, tickets: Ticket[], t: TFunction) => {
  const entries: SimpleLogItemEntry[] = [];

  if (registration.publishedDate) {
    entries.push({
      text: t('log.titles.result_published'),
      date: registration.publishedDate,
      bgcolor: 'neutral87.main',
      Icon: CheckIcon,
    });
  }

  if (registration.status === 'UNPUBLISHED') {
    const unpublishingNotes = registration.publicationNotes?.filter((note) => note.type === 'UnpublishingNote') ?? [];
    const lastUnpublishingNote = unpublishingNotes.pop();
    if (lastUnpublishingNote) {
      entries.push({
        text: t('log.titles.result_unpublished'),
        date: lastUnpublishingNote.createdDate,
        bgcolor: 'error.light',
        Icon: BlockIcon,
      });
    }
    return entries;
  }

  if (registration.status === 'DELETED') {
    entries.push({
      text: t('log.titles.result_deleted'),
      date: registration.modifiedDate,
      bgcolor: 'neutral87.main',
      Icon: CheckIcon,
    });
    return entries;
  }

  const allCurrentFiles = getAssociatedFiles(registration.associatedArtifacts);

  const hiddenFiles = allCurrentFiles.filter((file) => file.type === FileType.HiddenFile);
  hiddenFiles.forEach((file) => {
    entries.push({
      text: t('log.hidden_file_added'),
      date: file.uploadDetails?.uploadedDate,
      bgcolor: 'neutral87.main',
      Icon: CheckIcon,
    });
  });

  const filePublishingTickets = tickets.filter((ticket) => {
    if (ticket.type !== 'PublishingRequest') {
      return false;
    }
    const publishingTicket = ticket as PublishingTicket;
    return publishingTicket.filesForApproval.length + publishingTicket.approvedFiles.length > 0;
  }) as PublishingTicket[];

  filePublishingTickets.forEach((ticket) => {
    if (ticket.status === 'Completed') {
      const openFilesCount = ticket.approvedFiles.filter(
        (file) => isOpenFile(file) && fileIsStillRelevant(allCurrentFiles, file, filePublishingTickets, ticket)
      ).length;

      if (openFilesCount > 0) {
        entries.push({
          text: t('log.open_file_published_count', { count: openFilesCount }),
          date: ticket.finalizedDate ?? ticket.modifiedDate,
          bgcolor: 'neutral87.main',
          Icon: CheckIcon,
        });
      }

      const internalFilesCount = ticket.approvedFiles.filter(
        (file) =>
          file.type === FileType.InternalFile &&
          fileIsStillRelevant(allCurrentFiles, file, filePublishingTickets, ticket)
      ).length;
      if (internalFilesCount > 0) {
        entries.push({
          text: t('log.internal_file_approved_count', { count: internalFilesCount }),
          date: ticket.finalizedDate ?? ticket.modifiedDate,
          bgcolor: 'success.light',
          Icon: CheckIcon,
        });
      }
    } else if (ticket.status === 'Pending' || ticket.status === 'New') {
      const pendingOpenFilesCount = ticket.filesForApproval.filter(
        (file) => isPendingOpenFile(file) && fileIsStillRelevant(allCurrentFiles, file, filePublishingTickets, ticket)
      ).length;
      if (pendingOpenFilesCount > 0) {
        entries.push({
          text: t('log.titles.open_file_awaiting_approval', { count: pendingOpenFilesCount }),
          bgcolor: 'info.light',
          Icon: HourglassEmptyIcon,
        });
      }

      const pendingInternalFilesCount = ticket.filesForApproval.filter(
        (file) =>
          file.type === FileType.PendingInternalFile &&
          fileIsStillRelevant(allCurrentFiles, file, filePublishingTickets, ticket)
      ).length;
      if (pendingInternalFilesCount > 0) {
        entries.push({
          text: t('log.titles.internal_file_awaiting_approval', { count: pendingInternalFilesCount }),
          bgcolor: 'info.light',
          Icon: HourglassEmptyIcon,
        });
      }
    } else if (ticket.status === 'Closed') {
      const rejectedFilesCount = ticket.filesForApproval.filter((file) =>
        fileIsStillRelevant(allCurrentFiles, file, filePublishingTickets, ticket)
      ).length;
      if (rejectedFilesCount > 0) {
        entries.push({
          text: t('log.titles.files_rejected_count', { count: rejectedFilesCount }),
          date: ticket.finalizedDate ?? ticket.modifiedDate,
          bgcolor: 'warning.light',
          Icon: BlockIcon,
        });
      }
    }
  });

  return entries;
};
