import { Box, Typography } from '@mui/material';
import { Trans } from 'react-i18next';
import { getMaintenanceInfo } from '../../utils/status-message-helpers';
import { getLanguageString } from '../../utils/translation-helpers';

export const MaintenanceMessagePage = () => {
  const maintenanceInfo = getMaintenanceInfo();

  return (
    <Box sx={{ m: '2rem 0.5rem' }}>
      <Trans
        defaults={getLanguageString(maintenanceInfo?.message)}
        components={{
          h1: <Typography variant="h1" gutterBottom />,
          h2: <Typography variant="h2" gutterBottom />,
          p: <Typography gutterBottom />,
        }}
      />
    </Box>
  );
};
