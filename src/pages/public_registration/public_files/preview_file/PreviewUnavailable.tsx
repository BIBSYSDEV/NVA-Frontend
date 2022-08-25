import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const PreviewUnavailable = ({ ...props }) => {
  const { t } = useTranslation();

  return (
    <Typography variant="body2" {...props}>
      {t('registration.public_page.preview_unavailable')}
    </Typography>
  );
};
