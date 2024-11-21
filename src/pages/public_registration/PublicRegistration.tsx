import SearchIcon from '@mui/icons-material/Search';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { MinimizedMenuIconButton } from '../../components/SideMenu';
import { PreviousPathLocationState } from '../../types/locationState.types';
import { RegistrationLandingPage } from './RegistrationLandingPage';

const PublicRegistration = () => {
  const { t } = useTranslation();
  const location = useLocation<PreviousPathLocationState>();
  const previousPath = location.state?.previousPath;

  return (
    <Box
      sx={{
        p: { xs: '0.5rem', md: '1rem' },
        width: '100%',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 5fr' },
        gap: '0.5rem',
      }}>
      {previousPath && (
        <Box sx={{ alignSelf: 'start', justifySelf: 'start' }} component={Link} to={previousPath}>
          <MinimizedMenuIconButton title={t('common.search')}>
            <SearchIcon />
          </MinimizedMenuIconButton>
        </Box>
      )}
      <Box sx={{ gridColumn: { md: '2' } }}>
        <RegistrationLandingPage />
      </Box>
    </Box>
  );
};

export default PublicRegistration;
