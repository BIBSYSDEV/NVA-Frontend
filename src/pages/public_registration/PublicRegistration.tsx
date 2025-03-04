import SearchIcon from '@mui/icons-material/Search';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { MinimizedMenuIconButton } from '../../components/SideMenu';
import { PreviousPathLocationState } from '../../types/locationState.types';
import { RegistrationLandingPage } from './RegistrationLandingPage';
import { StyledPageWithSideMenu } from '../../components/PageWithSideMenu';

const PublicRegistration = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const locationState = location.state as PreviousPathLocationState;
  const previousPath = locationState?.previousPath;

  return (
    <StyledPageWithSideMenu>
      {previousPath && (
        <Box sx={{ alignSelf: 'start', justifySelf: 'start' }}>
          <MinimizedMenuIconButton title={t('common.search')} to={previousPath}>
            <SearchIcon />
          </MinimizedMenuIconButton>
        </Box>
      )}
      <Box sx={{ gridColumn: { md: '2' } }}>
        <RegistrationLandingPage />
      </Box>
    </StyledPageWithSideMenu>
  );
};

export default PublicRegistration;
