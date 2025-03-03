import { Box, Divider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FileType } from '../../../types/associatedArtifact.types';
import { Registration } from '../../../types/registration.types';

interface ArchivedFilesLogInfoProps {
  registration: Registration;
}

export const ArchivedFilesLogInfo = ({ registration }: ArchivedFilesLogInfoProps) => {
  const { t } = useTranslation();

  const internalFilesCount = registration.associatedArtifacts.filter(
    (file) => file.type === FileType.InternalFile
  ).length;
  const hiddenFilesCount = registration.associatedArtifacts.filter((file) => file.type === FileType.HiddenFile).length;

  if (internalFilesCount === 0 && hiddenFilesCount === 0) {
    return null;
  }

  return (
    <Box sx={{ px: '0.5rem' }}>
      <Divider sx={{ mb: '0.5rem' }} />
      {internalFilesCount > 0 && (
        <Typography color="grey.700" sx={{ textAlign: 'center' }}>
          {t('log.internal_files_on_registration', { count: internalFilesCount })}
        </Typography>
      )}
      {hiddenFilesCount > 0 && (
        <Typography color="grey.700" sx={{ textAlign: 'center' }}>
          {t('log.hidden_files_on_registration', { count: hiddenFilesCount })}
        </Typography>
      )}
    </Box>
  );
};
