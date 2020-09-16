import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Link as MuiLink, Typography, Divider } from '@material-ui/core';

const StyledLogo = styled.div`
  display: flex;
  flex-wrap: wrap;
  grid-area: logo;
`;

const StyledDivider = styled(Divider)`
  margin-left: 2rem;
`;

const Logo: FC = () => (
  <StyledLogo data-testid="logo">
    <MuiLink component={Link} to="/">
      <Typography color="textPrimary" variant="h5">
        NVA
      </Typography>
    </MuiLink>
    <StyledDivider orientation="vertical" flexItem />
  </StyledLogo>
);

export default Logo;
