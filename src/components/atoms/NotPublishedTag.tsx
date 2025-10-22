import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const NotPublishedTag = () => {
  const { t } = useTranslation();

  return (
    <Typography sx={{ p: '0.1rem 0.75rem', bgcolor: 'warning.light' }}>
      {t('registration.public_page.result_not_published')}
    </Typography>
  );
};
