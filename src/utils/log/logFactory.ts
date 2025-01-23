import BlockIcon from '@mui/icons-material/Block';
import CheckIcon from '@mui/icons-material/Check';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { StandardCSSProperties } from '@mui/system';
import { TFunction } from 'i18next';
import { FileType } from '../../types/associatedArtifact.types';
import { Log, LogEntry, LogEntryType } from '../../types/log.types';
import { PublishingTicket, Ticket } from '../../types/publication_types/ticket.types';
import { Registration } from '../../types/registration.types';
import { isOpenFile, isPendingOpenFile } from '../registration-helpers';
import { generateImportLogEntries } from './importEntryGenerator';
import { generateRegistrationLogEntries } from './registrationEntryGenerator';
import { generateTicketLogEntries } from './ticketEntryGenerator';

export function generateLog(registration: Registration, tickets: Ticket[], t: TFunction): Log {
  const importLogEntries = generateImportLogEntries(registration, t);
  const registrationLogEntries = generateRegistrationLogEntries(registration, tickets, t);
  const ticketLogEntries = generateTicketLogEntries(tickets, registration, t);

  const entries = [...importLogEntries, ...registrationLogEntries, ...ticketLogEntries];

  const internalFilesCount = registration.associatedArtifacts.filter(
    (file) => file.type === FileType.InternalFile
  ).length;

  const hiddenFilesCount = registration.associatedArtifacts.filter((file) => file.type === FileType.HiddenFile).length;

  return {
    entries: entries.sort(sortLogEntries),
    metadataUpdated: registration.modifiedDate,
    numberOfArchivedFiles: internalFilesCount,
    numberOfHiddenFiles: hiddenFilesCount,
  };
}

const logTypeOrder: LogEntryType[] = ['Import', 'Created', 'MetadataPublished', 'PublishingRequest', 'DoiRequest'];
const msMargin = 5_000; // 5 seconds

const sortLogEntries = (a: LogEntry, b: LogEntry) => {
  const dateA = new Date(a.modifiedDate);
  const dateB = new Date(b.modifiedDate);

  // Ignore date differences less than the margin
  // This is done to ensure a logical order if imported posts have some minor differences for timestamps
  const timeA = Math.floor(dateA.getTime());
  const timeB = Math.floor(dateB.getTime());
  const timeDiff = Math.abs(timeA - timeB);

  if (timeDiff > msMargin) {
    return timeB - timeA;
  }

  const indexA = logTypeOrder.indexOf(a.type);
  const indexB = logTypeOrder.indexOf(b.type);
  return indexB - indexA;
};

interface SimpleLogItemEntry {
  text: string;
  date?: string;
  bgcolor: StandardCSSProperties['backgroundColor'];
  Icon: typeof CheckIcon;
}

export const generateSimplePublishingLog = (registration: Registration, tickets: Ticket[], t: TFunction) => {
  const entries: SimpleLogItemEntry[] = [];

  if (registration.publishedDate) {
    entries.push({
      text: t('registration.status.PUBLISHED_METADATA'),
      date: registration.publishedDate,
      bgcolor: 'publishingRequest.main',
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
        bgcolor: 'publishingRequest.main',
        Icon: CheckIcon,
      });
    }
    return entries;
  }

  if (registration.status === 'DELETED') {
    entries.push({
      text: t('log.titles.result_deleted'),
      date: registration.modifiedDate,
      bgcolor: 'publishingRequest.main',
      Icon: CheckIcon,
    });
    return entries;
  }

  const filePublishingTickets = tickets.filter((ticket) => {
    if (ticket.type !== 'PublishingRequest') {
      return false;
    }
    const publishingTicket = ticket as PublishingTicket;
    return publishingTicket.filesForApproval.length + publishingTicket.approvedFiles.length > 0;
  }) as PublishingTicket[];

  filePublishingTickets.forEach((ticket) => {
    if (ticket.status === 'Completed') {
      const openFilesCount = ticket.approvedFiles.filter(isOpenFile).length;
      if (openFilesCount > 0) {
        entries.push({
          text: t('log.titles.file_published_count', { count: openFilesCount }),
          date: ticket.finalizedDate ?? ticket.modifiedDate,
          bgcolor: 'publishingRequest.main',
          Icon: CheckIcon,
        });
      }

      const internalFilesCount = ticket.approvedFiles.filter((file) => file.type === FileType.InternalFile).length;
      if (internalFilesCount > 0) {
        entries.push({
          text: t('log.titles.file_archived_count', { count: internalFilesCount }),
          date: ticket.finalizedDate ?? ticket.modifiedDate,
          bgcolor: 'publishingRequest.main',
          Icon: CheckIcon,
        });
      }
    } else if (ticket.status === 'Pending' || ticket.status === 'New') {
      const pendingOpenFilesCount = ticket.filesForApproval.filter(isPendingOpenFile).length;
      if (pendingOpenFilesCount > 0) {
        entries.push({
          text: t('log.titles.open_file_awaiting_approval', { count: pendingOpenFilesCount }),
          bgcolor: 'secondary.dark',
          Icon: HourglassEmptyIcon,
        });
      }

      const pendingInternalFilesCount = ticket.filesForApproval.filter(
        (file) => file.type === FileType.PendingInternalFile
      ).length;
      if (pendingInternalFilesCount > 0) {
        entries.push({
          text: t('log.titles.internal_file_awaiting_approval', { count: pendingInternalFilesCount }),
          bgcolor: 'secondary.dark',
          Icon: HourglassEmptyIcon,
        });
      }
    } else if (ticket.status === 'Closed') {
      const rejectedFilesCount = ticket.filesForApproval.length;
      if (rejectedFilesCount > 0) {
        entries.push({
          text: t('log.titles.files_rejected_count', { count: rejectedFilesCount }),
          date: ticket.finalizedDate ?? ticket.modifiedDate,
          bgcolor: 'secondary.dark',
          Icon: BlockIcon,
        });
      }
    }
  });

  return entries;
};
