import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const testEnvironments = ['localhost', 'dev', 'test', 'sandbox', 'e2e'];
const hostname = window.location.hostname;
const hostnameIsTestEnvironment = testEnvironments.some((testEnvironment) => hostname.startsWith(testEnvironment));

export const EnvironmentBanner = () => {
  const { t } = useTranslation();

  return hostnameIsTestEnvironment ? (
    <Typography sx={{ textAlign: 'center', background: '#ffd45a', p: '0.25rem' }}>
      {t('common.test_environment')} ({hostname})
    </Typography>
  ) : null;
};
