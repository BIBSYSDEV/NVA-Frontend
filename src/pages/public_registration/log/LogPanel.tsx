import { Box, Typography } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { useTranslation } from 'react-i18next';
import { useFetchRegistrationLog } from '../../../api/hooks/useFetchRegistrationLog';
import { LogDateItem } from '../../../components/Log/LogDateItem';
import { ArchivedFilesEntry } from '../../../components/Log/RegistrationLog';
import { FileType } from '../../../types/associatedArtifact.types';
import { Registration } from '../../../types/registration.types';
import { LogEntry } from './LogEntry';

interface LogPanelProps {
  registration: Registration;
}

export const LogPanel = ({ registration }: LogPanelProps) => {
  const { t } = useTranslation();
  const logQuery = useFetchRegistrationLog(registration.id);

  const internalFilesCount = registration.associatedArtifacts.filter(
    (file) => file.type === FileType.InternalFile
  ).length;
  const hiddenFilesCount = registration.associatedArtifacts.filter((file) => file.type === FileType.HiddenFile).length;

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', bgcolor: 'secondary.main' }}
      aria-busy={logQuery.isPending}>
      <Box sx={{ p: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography color="grey.700" sx={{ textAlign: 'center' }}>
          {t('log.metadata_last_updated')}
        </Typography>
        <LogDateItem date={new Date(registration.modifiedDate)} />
      </Box>
      <ArchivedFilesEntry numberOfArchivedFiles={internalFilesCount} numberOfHiddenFiles={hiddenFilesCount} />

      {logQuery.isPending ? (
        <>
          <Skeleton variant="rectangular" height={150} />
          <Skeleton variant="rectangular" height={150} />
          <Skeleton variant="rectangular" height={150} />
        </>
      ) : (
        logQuery.data?.logEntries.toReversed().map((logEntry, index) => <LogEntry key={index} logEntry={logEntry} />)
      )}
    </Box>
  );
};
