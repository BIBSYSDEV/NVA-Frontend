import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const testEnvironments = ['localhost', 'dev', 'test', 'sandbox', 'e2e'];
const hostname = window.location.hostname;
const hostnameIsTestEnvironment = testEnvironments.some((testEnvironment) => hostname.startsWith(testEnvironment));

export const EnvironmentBanner = () => {
  const { t } = useTranslation();
  const [minimizeBanner, setMinimizeBanner] = useState(false);

  return hostnameIsTestEnvironment ? (
    <Box
      sx={{ background: '#ffd45a', p: '0.5rem', cursor: 'pointer' }}
      onClick={() => setMinimizeBanner(!minimizeBanner)}>
      {!minimizeBanner && (
        <Typography sx={{ textAlign: 'center' }}>
          {t('common.test_environment')} ({hostname})
        </Typography>
      )}
    </Box>
  ) : null;
};
