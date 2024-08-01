import { ImportDetail } from '../../types/registration.types';
import { TFunction } from 'i18next';
import { SiktIdentifier } from '../constants';
import { LogEntry } from '../../types/log.types';
import { CristinApiPath } from '../../api/apiPaths';

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
