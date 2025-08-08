import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MaintenanceMessageContent } from '../pages/errorpages/MaintenanceMessagePage';
import { LocalStorageKey } from '../utils/constants';
import { getMaintenanceInfo, MaintenanceInfo } from '../utils/status-message-helpers';

const prodHostname = 'nva.sikt.no';
const hostname = window.location.hostname;
const defaultBannerState = localStorage.getItem(LocalStorageKey.EnvironmentBanner);

const isTestEnvironment = () => {
  return hostname !== prodHostname;
};

const shouldShowMaintenanceInfo = (maintenanceInfo: MaintenanceInfo | null) => {
  return maintenanceInfo && maintenanceInfo.severity !== 'block';
};

export const EnvironmentBanner = () => {
  const { t } = useTranslation();
  const [minimizeBanner, setMinimizeBanner] = useState(defaultBannerState === 'minimized');

  const maintenanceInfo = getMaintenanceInfo();

  const testEnvironment = isTestEnvironment();
  const showMaintenanceInfo = shouldShowMaintenanceInfo(maintenanceInfo);

  const shouldShowBanner = testEnvironment || showMaintenanceInfo;
  if (!shouldShowBanner) {
    return null;
  }

  return (
    <Box
      component="aside"
      sx={{ background: '#ffd45a', p: '0.5rem', cursor: showMaintenanceInfo ? undefined : 'pointer' }}
      onClick={
        showMaintenanceInfo
          ? undefined
          : () => {
              const newMinimizeBannerState = !minimizeBanner;
              setMinimizeBanner(newMinimizeBannerState);
              localStorage.setItem(LocalStorageKey.EnvironmentBanner, newMinimizeBannerState ? 'minimized' : 'normal');
            }
      }>
      {showMaintenanceInfo && (
        <Box sx={{ mx: 'auto', mt: '0.5rem', maxWidth: '50rem' }}>
          <MaintenanceMessageContent message={maintenanceInfo!.message} />
        </Box>
      )}

      {testEnvironment && (!minimizeBanner || showMaintenanceInfo) && (
        <Typography sx={{ textAlign: 'center' }}>
          {t('common.test_environment')} ({hostname})
        </Typography>
      )}
    </Box>
  );
};
