import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const AnnouncementsFieldsHeadline = () => {
  const { t } = useTranslation();

  return (
    <Typography variant="h3" gutterBottom>
      {t('registration.resource_type.artistic.announcements')}
    </Typography>
  );
};
