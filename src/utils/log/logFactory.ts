import { TFunction } from 'i18next';
import { Log, LogEntry, LogEntryType } from '../../types/log.types';
import { Ticket } from '../../types/publication_types/ticket.types';
import { Registration } from '../../types/registration.types';
import { getArchivedFiles } from '../registration-helpers';
import { generateImportLogEntries } from './importEntryGenerator';
import { generateRegistrationLogEntries } from './registrationEntryGenerator';
import { generateTicketLogEntries } from './ticketEntryGenerator';

export function generateLog(registration: Registration, tickets: Ticket[], t: TFunction): Log {
  const importLogEntries = generateImportLogEntries(registration.importDetails ?? [], t);
  const registrationLogEntries = generateRegistrationLogEntries(registration, tickets, t);
  const ticketLogEntries = generateTicketLogEntries(tickets, registration, t);

  const entries = [...importLogEntries, ...registrationLogEntries, ...ticketLogEntries];

  return {
    entries: entries.sort(sortLogEntries),
    metadataUpdated: registration.modifiedDate,
    numberOfArchivedFiles: getArchivedFiles(registration.associatedArtifacts, tickets).length,
  };
}

const logTypeOrder: LogEntryType[] = ['Import', 'Created', 'MetadataPublished', 'PublishingRequest', 'DoiRequest'];

const sortLogEntries = (a: LogEntry, b: LogEntry) => {
  const dateA = new Date(a.modifiedDate);
  const dateB = new Date(b.modifiedDate);

  // Ignore date differences less than a second
  const timeA = Math.floor(dateA.getTime() / 1000);
  const timeB = Math.floor(dateB.getTime() / 1000);

  if (timeA < timeB) return -1;
  if (timeA > timeB) return 1;

  const indexA = logTypeOrder.indexOf(a.type);
  const indexB = logTypeOrder.indexOf(b.type);
  return indexA - indexB;
};
