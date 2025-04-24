import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const PublisherOwnershipSettings = () => {
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="h1" gutterBottom>
        {t('editor.institution.administer_publisher_channel_ownership')}
      </Typography>
    </>
  );
};
