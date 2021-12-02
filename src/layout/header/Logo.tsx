import styled from 'styled-components';
import { Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { UrlPathTemplate } from '../../utils/urlPaths';

const StyledLogo = styled.div`
  grid-area: logo;
`;

export const Logo = () => (
  <StyledLogo>
    <Button data-testid="logo" component={RouterLink} to={UrlPathTemplate.Home}>
      <Typography variant="h5" component="span" sx={{ color: 'white', fontWeight: 900, fontSize: '3rem' }}>
        NVA
      </Typography>
    </Button>
  </StyledLogo>
);
