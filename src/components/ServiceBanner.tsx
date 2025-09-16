import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MaintenanceMessageContent } from '../pages/errorpages/MaintenanceMessagePage';
import { LocalStorageKey } from '../utils/constants';
import { getMaintenanceInfo } from '../utils/status-message-helpers';

const prodHostname = 'nva.sikt.no';
const hostname = window.location.hostname;
const isTestEnvironment = hostname !== prodHostname;
const defaultBannerState = localStorage.getItem(LocalStorageKey.EnvironmentBanner);

enum ServiceBannerVisibility {
  Minimized = 'minimized',
  Normal = 'normal',
}

export const ServiceBanner = () => {
  const { t } = useTranslation();
  const [minimizeBanner, setMinimizeBanner] = useState(defaultBannerState === ServiceBannerVisibility.Minimized);

  const maintenanceInfo = getMaintenanceInfo();
  const showMaintenanceInfo = maintenanceInfo && maintenanceInfo.severity !== 'block';

  const shouldShowBanner = isTestEnvironment || showMaintenanceInfo;
  if (!shouldShowBanner) {
    return null;
  }

  return (
    <Box
      component="aside"
      sx={{
        bgcolor: 'warning.light',
        p: '0.5rem',
        cursor: showMaintenanceInfo ? undefined : 'pointer',
      }}
      onClick={
        showMaintenanceInfo
          ? undefined
          : () => {
              const newMinimizeBannerState = !minimizeBanner;
              setMinimizeBanner(newMinimizeBannerState);
              localStorage.setItem(
                LocalStorageKey.EnvironmentBanner,
                newMinimizeBannerState ? ServiceBannerVisibility.Minimized : ServiceBannerVisibility.Normal
              );
            }
      }>
      <Box sx={{ mx: 'auto', maxWidth: '50rem', textAlign: 'center' }}>
        {isTestEnvironment && (!minimizeBanner || showMaintenanceInfo) && (
          <Typography>
            {t('common.test_environment')} ({hostname})
          </Typography>
        )}
        {showMaintenanceInfo && <MaintenanceMessageContent message={maintenanceInfo.message} />}
      </Box>
    </Box>
  );
};
