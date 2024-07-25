import { TFunction } from 'i18next';
import { generateImportLogEntries } from './importEntryGenerator';
import { generateRegistrationLogEntries } from './registrationEntryGenerator';
import { generateTicketLogEntries } from './ticketEntryGenerator';
import { getArchivedFiles } from '../registration-helpers';
import { Log, LogEntry } from '../../types/log.types';
import { Ticket } from '../../types/publication_types/ticket.types';
import { Registration } from '../../types/registration.types';

export function generateLog(registration: Registration, tickets: Ticket[], t: TFunction): Log {
  const importLogEntries = generateImportLogEntries(registration.importDetails ?? [], t);
  const registrationLogEntries = generateRegistrationLogEntries(registration, tickets, t);
  const ticketLogEntries = generateTicketLogEntries(tickets, registration, t);

  const entries = [...importLogEntries, ...registrationLogEntries, ...ticketLogEntries];

  return {
    entries: entries.sort(sortByModifiedDateAndThenMetadataPublished),
    metadataUpdated: registration.modifiedDate,
    numberOfArchivedFiles: getArchivedFiles(registration.associatedArtifacts, tickets).length,
  };
}

const sortByModifiedDateAndThenMetadataPublished = (a: LogEntry, b: LogEntry) => {
  const aDate = new Date(a.modifiedDate);
  const bDate = new Date(b.modifiedDate);

  if (bDate < aDate) return 1;
  if (bDate > aDate) return -1;
  else {
    if (b.type === 'MetadataPublished') return 1;
    if (a.type === 'MetadataPublished') return -1;
    return 0;
  }
};
