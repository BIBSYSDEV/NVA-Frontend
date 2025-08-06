import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LocalStorageKey } from '../utils/constants';

const testEnvironments = ['localhost', 'dev', 'test', 'sandbox', 'e2e'];
const hostname = window.location.hostname;
const hostnameIsTestEnvironment =
  hostname && testEnvironments.some((testEnvironment) => hostname.startsWith(testEnvironment));
const defaultBannerState = localStorage.getItem(LocalStorageKey.EnvironmentBanner);

export const EnvironmentBanner = () => {
  const { t } = useTranslation();

  const [minimizeBanner, setMinimizeBanner] = useState(defaultBannerState === 'minimized');

  return hostnameIsTestEnvironment && defaultBannerState !== 'none' ? (
    <Box
      component="aside"
      sx={{ background: '#b4aeff', p: '0.5rem', cursor: 'pointer' }}
      onClick={() => {
        const newMinimizeBannerState = !minimizeBanner;
        setMinimizeBanner(newMinimizeBannerState);
        localStorage.setItem(LocalStorageKey.EnvironmentBanner, newMinimizeBannerState ? 'minimized' : 'normal');
      }}>
      {!minimizeBanner && (
        <Typography sx={{ textAlign: 'center' }}>
          {t('common.test_environment')} ({hostname})
        </Typography>
      )}
    </Box>
  ) : null;
};
