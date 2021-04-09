import React from 'react';
import styled from 'styled-components';
import { LinkProps, Link, Typography } from '@material-ui/core';

const StyledSkipLink = styled(Link)`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 3rem;
  background-color: #1a1a18;

  :focus {
    position: static;
  }
`;

const StyledTypography = styled(Typography)`
  color: #fff;
  outline: 3px solid #e24c5e;
  outline-offset: 3px;
`;

export const SkipLink = ({ children, ...props }: LinkProps) => (
  <StyledSkipLink underline="none" {...props}>
    <StyledTypography>{children}</StyledTypography>
  </StyledSkipLink>
);
