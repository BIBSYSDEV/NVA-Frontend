import { Box } from '@mui/material';
import { RegistrationLandingPage } from './RegistrationLandingPage';

const PublicRegistration = () => (
  <Box
    sx={{
      p: { xs: '0.5rem', md: '1rem' },
      width: '100%',
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', md: '1fr 5fr' },
    }}>
    <Box sx={{ gridColumn: '2' }}>
      <RegistrationLandingPage />
    </Box>
  </Box>
);

export default PublicRegistration;
