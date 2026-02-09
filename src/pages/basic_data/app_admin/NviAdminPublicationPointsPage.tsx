import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const NviAdminPublicationPointsPage = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Typography variant="h1" gutterBottom>
        {t('basic_data.nvi.publication_points_status')}
      </Typography>
    </div>
  );
};
