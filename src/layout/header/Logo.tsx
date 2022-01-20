import { Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { UrlPathTemplate } from '../../utils/urlPaths';

export const Logo = () => (
  <Box sx={{ gridArea: 'logo' }}>
    <Button data-testid="logo" component={RouterLink} to={UrlPathTemplate.Home}>
      <Typography variant="h5" component="span" sx={{ color: 'white', fontWeight: 900, fontSize: '3rem' }}>
        NVA
      </Typography>
    </Button>
  </Box>
);
