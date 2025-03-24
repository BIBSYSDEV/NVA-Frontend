import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ImportSourceLogData } from '../../../types/log.types';

export const LogEntryImportSourceInfo = ({ importSource }: { importSource: ImportSourceLogData }) => {
  const { t } = useTranslation();

  return (
    <Typography>
      {importSource.archive
        ? t('log.imported_from_source_and_archive', {
            source: importSource.source,
            archive: importSource.archive,
          })
        : t('log.imported_from_source', {
            source: importSource.source,
          })}
    </Typography>
  );
};
