import { SxProps } from '@mui/material';
import { TFunction } from 'i18next';
import { ReactNode } from 'react';
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

  return {
    entries: entries.sort(sortLogEntries),
    metadataUpdated: registration.modifiedDate,
    numberOfArchivedFiles: internalFilesCount,
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
    return timeA - timeB;
  }

  const indexA = logTypeOrder.indexOf(a.type);
  const indexB = logTypeOrder.indexOf(b.type);
  return indexA - indexB;
};

interface SimpleLogItemEntry {
  text: string;
  date: string;
  bgcolor?: Extract<SxProps, 'bgcolor'>;
  icon?: ReactNode;
}

export const generateSimplePublishingLog = (registration: Registration, tickets: Ticket[], t: TFunction) => {
  const entries: SimpleLogItemEntry[] = [];

  if (registration.publishedDate) {
    entries.push({
      text: t('registration.status.PUBLISHED_METADATA'),
      date: registration.publishedDate,
    });
  }

  if (registration.status === 'UNPUBLISHED') {
    const unpublishingNotes = registration.publicationNotes?.filter((note) => note.type === 'UnpublishingNote') ?? [];
    const lastUnpublishingNote = unpublishingNotes.pop();
    if (lastUnpublishingNote) {
      entries.push({
        text: t('log.titles.result_unpublished'),
        date: lastUnpublishingNote.createdDate,
      });
    }
    return entries;
  }

  if (registration.status === 'DELETED') {
    entries.push({
      text: t('log.titles.result_deleted'),
      date: registration.modifiedDate,
    });
    return entries;
  }

  const publishingTickets = tickets.filter((ticket) => ticket.type === 'PublishingRequest') as PublishingTicket[];
  const filePublishingTickets = publishingTickets.filter(
    (ticket) => ticket.filesForApproval.length + ticket.approvedFiles.length > 0
  );

  filePublishingTickets.forEach((ticket) => {
    if (ticket.status === 'Completed') {
      const openFilesCount = ticket.approvedFiles.filter(isOpenFile).length;
      if (openFilesCount > 0) {
        entries.push({
          text: t('log.titles.file_published_count', { count: openFilesCount }),
          date: ticket.finalizedDate ?? ticket.modifiedDate,
        });
      }

      const internalFilesCount = ticket.approvedFiles.filter((file) => file.type === FileType.InternalFile).length;
      if (internalFilesCount > 0) {
        entries.push({
          text: t('log.titles.internal_file_approved_count', { count: internalFilesCount }),
          date: ticket.finalizedDate ?? ticket.modifiedDate,
        });
      }
    } else if (ticket.status === 'Pending' || ticket.status === 'New') {
      const pendingOpenFilesCount = ticket.filesForApproval.filter(isPendingOpenFile).length;
      if (pendingOpenFilesCount > 0) {
        entries.push({
          text: t('log.titles.open_file_awaiting_approval', { count: pendingOpenFilesCount }),
          date: ticket.finalizedDate ?? ticket.modifiedDate,
        });
      }

      const pendingInternalFilesCount = ticket.filesForApproval.filter(
        (file) => file.type === FileType.PendingInternalFile
      ).length;
      if (pendingInternalFilesCount > 0) {
        entries.push({
          text: t('log.titles.internal_file_awaiting_approval', { count: pendingInternalFilesCount }),
          date: ticket.finalizedDate ?? ticket.modifiedDate,
        });
      }
    }
  });

  return entries;
};
