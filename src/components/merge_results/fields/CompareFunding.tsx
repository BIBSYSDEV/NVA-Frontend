import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const CompareFunding = () => {
  const { t } = useTranslation();

  return <Typography>{t('lokalise')}</Typography>;
};
