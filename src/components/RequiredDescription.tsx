import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const RequiredDescription = () => {
  const { t } = useTranslation('common');

  return (
    <Box sx={{ mt: '1rem', mb: '0.25rem', display: 'flex', gap: '0.5rem' }}>
      <Typography sx={{ fontWeight: 'bold', color: 'error.main' }}>*</Typography>
      <Typography fontStyle="italic">{t('required_description')}</Typography>
    </Box>
  );
};
