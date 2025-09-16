import { Box, Container } from '@mui/material';
import FrontPageHeading from './FrontPageHeading';

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
      maxWidth="md"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
      <FrontPageHeading />
    </Container>
  </Box>
);

export default FrontPage;
