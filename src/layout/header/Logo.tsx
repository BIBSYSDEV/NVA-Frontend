import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Link as MuiLink, Typography, Divider } from '@material-ui/core';
import { UrlPathTemplate } from '../../utils/urlPaths';

const StyledLogo = styled.div`
  display: flex;
  flex-wrap: wrap;
  grid-area: logo;
  justify-content: center;
`;

const StyledDivider = styled(Divider)`
  margin-left: 2rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    display: none;
  }
`;

const Logo: FC = () => (
  <StyledLogo data-testid="logo">
    <MuiLink component={Link} to={UrlPathTemplate.Home}>
      <Typography color="textPrimary" variant="h5">
        NVA
      </Typography>
    </MuiLink>
    <StyledDivider orientation="vertical" flexItem />
  </StyledLogo>
);

export default Logo;
