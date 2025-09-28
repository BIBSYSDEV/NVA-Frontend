import { Box } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { HeadTitle } from '../../components/HeadTitle';
import { LocalStorageKey } from '../../utils/constants';
import HomePage from './HomePage';

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const loginPath = localStorage.getItem(LocalStorageKey.RedirectPath);
    if (loginPath) {
      localStorage.removeItem(LocalStorageKey.RedirectPath);
      navigate(loginPath, { replace: true });
    }
  }, [navigate]);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateAreas: "'tagline' 'description' 'links'",
        justifyItems: 'center',
        width: '100%',
      }}>
      <HeadTitle>{t('common.start_page')}</HeadTitle>
      <HomePage />
    </Box>
  );
};

export default Dashboard;
