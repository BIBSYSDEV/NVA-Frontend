import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { HeadTitle } from '../../components/HeadTitle';
import HomePage from './HomePage';

const Dashboard = () => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateAreas: "'tagline' 'description' 'links'",
        justifyItems: 'center',
        width: '100%',
      }}>
      <HeadTitle>{t('common.filter')}</HeadTitle>
      <HomePage />
    </Box>
  );
};

export default Dashboard;
