import CheckIcon from '@mui/icons-material/Check';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const FinishedTag = () => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        bgcolor: 'success.light',
        borderRadius: '2rem',
        px: 1.25,
        py: 0.25,
        gap: '0.25rem',
        fontWeight: 500,
      }}>
      <CheckIcon fontSize="small" />
      <Typography>{t('finished')}</Typography>
    </Box>
  );
};
