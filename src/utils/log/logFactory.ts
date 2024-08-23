import { TFunction } from 'i18next';
import { ImportUploadDetails } from '../../types/associatedArtifact.types';
import { Log, LogEntry } from '../../types/log.types';
import { Ticket } from '../../types/publication_types/ticket.types';
import { Registration } from '../../types/registration.types';
import { getArchivedFiles, getPublishedFiles } from '../registration-helpers';
import { generateImportLogEntries } from './importEntryGenerator';
import { generateRegistrationLogEntries } from './registrationEntryGenerator';
import { generateTicketLogEntries } from './ticketEntryGenerator';

export function generateLog(registration: Registration, tickets: Ticket[], t: TFunction): Log {
  const importLogEntries = generateImportLogEntries(registration.importDetails ?? [], t);
  const registrationLogEntries = generateRegistrationLogEntries(registration, tickets, t);
  const ticketLogEntries = generateTicketLogEntries(tickets, registration, t);

  const importedFiles: LogEntry[] = getPublishedFiles(registration.associatedArtifacts)
    .filter((file) => file.uploadDetails?.type === 'ImportUploadDetails')
    .map((file) => {
      const importDetails = file.uploadDetails as ImportUploadDetails;
      return {
        type: 'PublishingRequest',
        title: t('log.titles.files_published_one'),
        modifiedDate: importDetails.uploadedDate,
        actions: [{ organization: importDetails.archive, items: [{ description: file.name, fileIcon: 'file' }] }],
      };
    });

  const entries = [...importLogEntries, ...registrationLogEntries, ...ticketLogEntries, ...importedFiles];

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
