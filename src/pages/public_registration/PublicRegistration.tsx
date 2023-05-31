import { Box } from '@mui/material';
import { RegistrationLandingPage } from './RegistrationLandingPage';

const PublicRegistration = () => (
  <Box sx={{ m: { xs: '0.5rem', md: '1rem' }, display: 'grid', gridTemplateColumns: '1fr 5fr' }}>
    <Box sx={{ gridColumn: '2' }}>
      <RegistrationLandingPage />
    </Box>
  </Box>
);

export default PublicRegistration;
