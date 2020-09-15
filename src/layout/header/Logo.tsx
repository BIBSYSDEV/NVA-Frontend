import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Link as MuiLink, Typography } from '@material-ui/core';

const StyledLogo = styled.div`
  display: flex;
  flex-wrap: wrap;
  grid-area: logo;
`;

const StyledSpan = styled(Typography)`
  padding-left: 2rem;
`;

const Logo: FC = () => (
  <StyledLogo data-testid="logo">
    <MuiLink component={Link} to="/">
      <Typography color="textPrimary" variant="h5">
        NVA
      </Typography>
    </MuiLink>
    <StyledSpan variant="h5">|</StyledSpan>
  </StyledLogo>
);

export default Logo;
