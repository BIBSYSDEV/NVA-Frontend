import { TFunction } from 'i18next';
import { CristinApiPath } from '../../api/apiPaths';
import { AssociatedArtifact, ImportUploadDetails } from '../../types/associatedArtifact.types';
import { LogEntry } from '../../types/log.types';
import { ImportDetail, Registration } from '../../types/registration.types';
import { SiktIdentifier } from '../constants';
import { getPublishedFiles } from '../registration-helpers';

export function generateImportLogEntries(registration: Registration, t: TFunction): LogEntry[] {
  const importDetails = registration.importDetails ?? [];

  const importLogEntries = importDetails.map((detail) => generateImportLogEntry(detail, t));
  const importedFilesLogEntries = generateImportedFilesLogEntries(registration.associatedArtifacts, t);

  return [...importLogEntries, ...importedFilesLogEntries];
}

function generateImportLogEntry(importDetail: ImportDetail, t: TFunction): LogEntry {
  const importDescription = importDetail.importSource.archive
    ? t('log.imported_from_source_and_archive', {
        source: importDetail.importSource.source,
        archive: importDetail.importSource.archive,
      })
    : t('log.imported_from_source', {
        source: importDetail.importSource.source,
      });

  return {
    type: 'Import',
    title: t('log.titles.imported'),
    modifiedDate: importDetail.importDate,
    actions: [
      {
        organization: `${CristinApiPath.Organization}/${SiktIdentifier}`,
        items: [
          {
            description: importDescription,
            date: importDetail.importDate,
          },
        ],
      },
    ],
  };
}

function generateImportedFilesLogEntries(associatedArtifacts: AssociatedArtifact[], t: TFunction): LogEntry[] {
  const importedFilesLogEntries: LogEntry[] = getPublishedFiles(associatedArtifacts)
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

  return importedFilesLogEntries;
}
