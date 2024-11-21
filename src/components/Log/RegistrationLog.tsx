import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Box, Divider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Log as LogType } from '../../types/log.types';
import { toDateStringWithTime } from '../../utils/date-helpers';
import { LogEntry } from './LogEntry';

interface LogProps {
  log: LogType;
}

export const RegistrationLog = ({ log }: LogProps) => {
  return (
    <>
      <MetaDataLastUpdatedEntry metadataUpdated={log.metadataUpdated} />
      <ArchivedFilesEntry numberOfArchivedFiles={log.numberOfArchivedFiles} />
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
      <Box sx={{ display: 'flex' }}>
        <CalendarMonthIcon color="primary" fontSize="small" />
        <Typography color="grey.700" sx={{ textAlign: 'center' }}>
          {toDateStringWithTime(lastUpdated)}
        </Typography>
      </Box>
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
