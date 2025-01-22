import { Box, Divider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Log as LogType } from '../../types/log.types';
import { LogDateItem } from './LogDateItem';
import { LogEntry } from './LogEntry';

interface LogProps {
  log: LogType;
}

export const RegistrationLog = ({ log }: LogProps) => {
  return (
    <>
      <MetaDataLastUpdatedEntry metadataUpdated={log.metadataUpdated} />
      <ArchivedFilesEntry
        numberOfArchivedFiles={log.numberOfArchivedFiles}
        numberOfHiddenFiles={log.numberOfHiddenFiles}
      />
      {log.entries.map((entry, index) => (
        <LogEntry {...entry} key={index} />
      ))}
    </>
  );
};

const MetaDataLastUpdatedEntry = ({ metadataUpdated }: Pick<LogType, 'metadataUpdated'>) => {
  const { t } = useTranslation();
  const lastUpdated = new Date(metadataUpdated);

  return (
    <Box sx={{ p: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography color="grey.700" sx={{ textAlign: 'center' }}>
        {t('log.metadata_last_updated')}
      </Typography>
      <LogDateItem date={lastUpdated} />
    </Box>
  );
};

const ArchivedFilesEntry = ({
  numberOfArchivedFiles,
  numberOfHiddenFiles,
}: Pick<LogType, 'numberOfArchivedFiles' | 'numberOfHiddenFiles'>) => {
  const { t } = useTranslation();
  if (numberOfArchivedFiles === 0 && numberOfHiddenFiles === 0) {
    return null;
  }

  return (
    <Box sx={{ px: '0.5rem' }}>
      <Divider sx={{ mb: '0.5rem' }} />
      {numberOfArchivedFiles > 0 && (
        <Typography color="grey.700" sx={{ textAlign: 'center' }}>
          {t('log.archived_files_on_registration', { count: numberOfArchivedFiles })}
        </Typography>
      )}
      {numberOfHiddenFiles > 0 && (
        <Typography color="grey.700" sx={{ textAlign: 'center' }}>
          {t('log.hidden_files_on_registration', { count: numberOfHiddenFiles })}
        </Typography>
      )}
    </Box>
  );
};
