import { ImportDetail } from '../../types/registration.types';
import { TFunction } from 'i18next';
import { LogEntry } from '../../types/log.types';

export function generateImportLogEntries(importDetails: ImportDetail[], t: TFunction): LogEntry[] {
  return importDetails.map((detail) => generateImportLogEntry(detail, t));
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
    type: 'import',
    title: t('log.titles.imported'),
    modifiedDate: importDetail.importDate,
    actions: [
      {
        organization: '20754.0.0.0', // SIKT
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
