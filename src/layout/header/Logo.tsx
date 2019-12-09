import React from 'react';
import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@material-ui/core';
import styled from 'styled-components';

const StyledLogo = styled.div`
  color: ${({ theme }) => theme.palette.text.secondary};
  font-size: 2rem;
  grid-area: logo;
`;

const Logo: React.FC = () => (
  <MuiLink component={Link} to="/">
    <StyledLogo>NVA</StyledLogo>
  </MuiLink>
);

export default Logo;
