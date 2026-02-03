import { Box, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';

export const NviStatusPage = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <Typography variant="h1" sx={{ mb: '0.5rem' }}>
        {t('basic_data.nvi.reporting_status')}
      </Typography>
      <Trans
        t={t}
        i18nKey="basic_data.nvi.reporting_status_description"
        components={{ p: <Typography sx={{ mb: '0.5rem' }} /> }}
      />
    </Box>
  );
};
