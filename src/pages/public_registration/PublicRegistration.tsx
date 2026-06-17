import SearchIcon from '@mui/icons-material/Search';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { RegistrationLandingPage } from '../../components/registration-landing-page/RegistrationLandingPage';
import { MinimizedMenuIconButton } from '../../components/SideMenu';
import { PreviousPathLocationState } from '../../types/locationState.types';

const PublicRegistration = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as PreviousPathLocationState;
  const previousPath = locationState?.previousPath;

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
        <Box sx={{ alignSelf: 'start', justifySelf: 'start' }}>
          <MinimizedMenuIconButton title={t('common.search')} onClick={() => navigate(-1)}>
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
