import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { LocalStorageKey } from '../utils/constants';
import { getMaintenanceInfo } from '../utils/status-message-helpers';
import { getLanguageString } from '../utils/translation-helpers';

const prodHostname = 'nva.sikt.no';
const hostname = window.location.hostname;
const hostnameIsTestEnvironment = hostname !== prodHostname;
const defaultBannerState = localStorage.getItem(LocalStorageKey.EnvironmentBanner);

export const EnvironmentBanner = () => {
  const { t } = useTranslation();
  const [minimizeBanner, setMinimizeBanner] = useState(defaultBannerState === 'minimized');

  const maintenanceInfo = getMaintenanceInfo();

  const showTestEnvironmentInfo = hostnameIsTestEnvironment && defaultBannerState !== 'none';
  const showMaintenanceBanner = maintenanceInfo && maintenanceInfo?.severity !== 'block';

  const shouldShowBanner = showTestEnvironmentInfo || showMaintenanceBanner;
  if (!shouldShowBanner) {
    return null;
  }

  return (
    <Box
      component="aside"
      sx={{ background: '#ffd45a', p: '0.5rem', cursor: showMaintenanceBanner ? undefined : 'pointer' }}
      onClick={
        showMaintenanceBanner
          ? undefined
          : () => {
              const newMinimizeBannerState = !minimizeBanner;
              setMinimizeBanner(newMinimizeBannerState);
              localStorage.setItem(LocalStorageKey.EnvironmentBanner, newMinimizeBannerState ? 'minimized' : 'normal');
            }
      }>
      {showMaintenanceBanner && (
        <Box sx={{ m: 'auto', width: 'fit-content', maxWidth: '50rem' }}>
          <Trans
            defaults={getLanguageString(maintenanceInfo.message)}
            components={{
              h1: <Typography variant="h1" gutterBottom />,
              h2: <Typography variant="h2" gutterBottom />,
              p: <Typography gutterBottom />,
            }}
          />
        </Box>
      )}

      {!minimizeBanner && (
        <Typography sx={{ textAlign: 'center' }}>
          {t('common.test_environment')} ({hostname})
        </Typography>
      )}
    </Box>
  );
};
