import { Box, Container } from '@mui/material';
import FrontPageHeader from './FrontPageHeader';

const FrontPage = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      bgcolor: '#EFEFEF',
      minHeight: '100vh',
      width: '100%',
    }}>
    <Container
      maxWidth="lg"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: { xs: 4, sm: 8 },
      }}>
      <FrontPageHeader />
    </Container>
  </Box>
);

export default FrontPage;
