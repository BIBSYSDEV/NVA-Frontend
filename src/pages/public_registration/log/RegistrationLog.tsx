import { Box, Divider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface ArchivedFilesEntryProps {
  numberOfArchivedFiles: number;
  numberOfHiddenFiles: number;
}

export const ArchivedFilesEntry = ({ numberOfArchivedFiles, numberOfHiddenFiles }: ArchivedFilesEntryProps) => {
  const { t } = useTranslation();
  if (numberOfArchivedFiles === 0 && numberOfHiddenFiles === 0) {
    return null;
  }

  return (
    <Box sx={{ px: '0.5rem' }}>
      <Divider sx={{ mb: '0.5rem' }} />
      {numberOfArchivedFiles > 0 && (
        <Typography color="grey.700" sx={{ textAlign: 'center' }}>
          {t('log.internal_files_on_registration', { count: numberOfArchivedFiles })}
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
