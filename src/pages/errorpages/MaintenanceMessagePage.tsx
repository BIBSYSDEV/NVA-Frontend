import { Box, Typography } from '@mui/material';
import { Trans } from 'react-i18next';
import { OpenInNewLink } from '../../components/OpenInNewLink';
import { LanguageString } from '../../types/common.types';
import { dataTestId } from '../../utils/dataTestIds';
import { getMaintenanceInfo } from '../../utils/status-message-helpers';
import { getLanguageString } from '../../utils/translation-helpers';

export const MaintenanceMessagePage = () => {
  const maintenanceInfo = getMaintenanceInfo();

  return (
    <Box sx={{ m: '2rem 0.5rem', maxWidth: '50rem' }}>
      <MaintenanceMessageContent message={maintenanceInfo!.message} />
    </Box>
  );
};

interface MaintenanceMessageContentProps {
  message: LanguageString;
}

export const MaintenanceMessageContent = ({ message }: MaintenanceMessageContentProps) => {
  return (
    <Trans
      defaults={getLanguageString(message)}
      components={{
        h1: <Typography variant="h1" gutterBottom />,
        h2: <Typography variant="h2" gutterBottom />,
        p: <Typography />,
        a: <OpenInNewLink data-testid={dataTestId.serviceBanner.serviceInfoLink} />,
      }}
    />
  );
};
