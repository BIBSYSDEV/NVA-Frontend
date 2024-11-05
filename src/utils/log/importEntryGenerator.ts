import { TFunction } from 'i18next';
import { CristinApiPath } from '../../api/apiPaths';
import { AssociatedArtifact, ImportUploadDetails } from '../../types/associatedArtifact.types';
import { LogEntry } from '../../types/log.types';
import { ImportDetail, Registration } from '../../types/registration.types';
import { SiktIdentifier } from '../constants';
import { getOpenFiles } from '../registration-helpers';

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
  const importedFiles = getOpenFiles(associatedArtifacts).filter(
    (file) => file.uploadDetails?.type === 'ImportUploadDetails'
  );

  const archives = [...new Set(importedFiles.map((file) => (file.uploadDetails as ImportUploadDetails).archive))];

  const logEntries: LogEntry[] = archives.map((archive) => {
    const filesFromThisArchive = importedFiles.filter(
      (file) => (file.uploadDetails as ImportUploadDetails).archive === archive
    );

    return {
      type: 'PublishingRequest',
      title: t('log.titles.files_published', { count: filesFromThisArchive.length }),
      modifiedDate: filesFromThisArchive[0].publishedDate ?? '',
      actions: [
        {
          organization: archive,
          items: filesFromThisArchive.map((file) => ({ description: file.name, fileIcon: 'file' })),
        },
      ],
    };
  });

  return logEntries;
}
