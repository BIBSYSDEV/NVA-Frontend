import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const CentralImport = () => {
  const { t } = useTranslation('basicData');
  return <Typography variant="h2">{t('central_import')}</Typography>;
};
