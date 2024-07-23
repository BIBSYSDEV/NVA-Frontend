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
  const ticketLogEntries = generateTicketLogEntries(tickets, registration, t);
  const registrationLogEntries = generateRegistrationLogEntries(registration, t);

  return {
    entries: sortByDateAsc([...importLogEntries, ...ticketLogEntries, ...registrationLogEntries]),
    metadataUpdated: registration.modifiedDate,
    numberOfArchivedFiles: getArchivedFiles(registration.associatedArtifacts, tickets).length,
  };
}

function sortByDateAsc(entries: LogEntry[]) {
  return entries.sort((a, b) => new Date(a.modifiedDate).getTime() - new Date(b.modifiedDate).getTime());
}
