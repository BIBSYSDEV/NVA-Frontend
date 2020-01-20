import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Link as MuiLink } from '@material-ui/core';

const StyledLogo = styled.div`
  color: ${({ theme }) => theme.palette.text.secondary};
  font-size: 2rem;
  grid-area: logo;
`;

const Logo: React.FC = () => (
  <MuiLink component={Link} to="/">
    <StyledLogo data-testid="logo">NVA</StyledLogo>
  </MuiLink>
);

export default Logo;
