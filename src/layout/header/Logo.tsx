import React from 'react';
import styled from 'styled-components';
import { Typography, Divider, Button } from '@material-ui/core';
import { UrlPathTemplate } from '../../utils/urlPaths';

const StyledLogo = styled.div`
  grid-area: logo;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    grid-template-columns: 1fr;
  }
`;

export const Logo = () => (
  <StyledLogo>
    <Button data-testid="logo" href={UrlPathTemplate.Home}>
      <Typography variant="h5" component="span">
        NVA
      </Typography>
    </Button>
    <Divider orientation="vertical" component="span" />
  </StyledLogo>
);
