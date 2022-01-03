import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const PreviewUnavailable = ({ ...props }) => {
  const { t } = useTranslation('registration');

  return (
    <Typography variant="body2" {...props}>
      {t('public_page.preview_unavailable')}
    </Typography>
  );
};
