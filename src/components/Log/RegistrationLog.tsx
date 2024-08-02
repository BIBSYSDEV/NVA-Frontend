import { Box, Divider, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LogEntry } from './LogEntry';
import { Log as LogType } from '../../types/log.types';
import { toDateString } from '../../utils/date-helpers';

interface LogProps {
  log: LogType;
}

export const RegistrationLog = ({ log }: LogProps) => {
  return (
    <>
      <MetaDataLUpdatedEntry metadataUpdated={log.metadataUpdated} />
      <ArchivedFilesEntry numberOfArchivedFiles={log.numberOfArchivedFiles} />
      {log.entries.map((entry, index) => (
        <LogEntry {...entry} key={index} />
      ))}
    </>
  );
};

const MetaDataLUpdatedEntry = ({ metadataUpdated }: Pick<LogType, 'metadataUpdated'>) => {
  const { t } = useTranslation();
  const lastUpdated = new Date(metadataUpdated);

  return (
    <Box sx={{ display: 'flex', px: '0.5rem' }}>
      <Typography align="center" color="grey.700">
        {t('log.metadata_last_updated')}
        <Tooltip title={lastUpdated.toLocaleTimeString()}>
          <span>{toDateString(lastUpdated)}</span>
        </Tooltip>
      </Typography>
    </Box>
  );
};

const ArchivedFilesEntry = ({ numberOfArchivedFiles }: Pick<LogType, 'numberOfArchivedFiles'>) => {
  const { t } = useTranslation();
  if (!numberOfArchivedFiles) {
    return;
  }

  return (
    <Box sx={{ px: '0.5rem' }}>
      <Divider />
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: '0.5rem' }}>
        <Typography color="grey.700">
          {t('log.number_of_archivedFiles_on_registration', { count: numberOfArchivedFiles })}
        </Typography>
      </Box>
    </Box>
  );
};
