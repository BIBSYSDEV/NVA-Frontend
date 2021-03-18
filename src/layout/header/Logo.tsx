import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import { Typography, Divider, Button } from '@material-ui/core';
import { UrlPathTemplate } from '../../utils/urlPaths';

const StyledLogo = styled.div`
  display: flex;
  grid-area: logo;
  justify-content: center;
`;

const StyledDivider = styled(Divider)`
  margin-left: 2rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    display: none;
  }
`;

export const Logo = () => (
  <StyledLogo>
    <Button component={RouterLink} data-testid="logo" to={UrlPathTemplate.Home}>
      <Typography variant="h5" component="h1">
        NVA
      </Typography>
    </Button>
    <StyledDivider orientation="vertical" flexItem />
  </StyledLogo>
);
