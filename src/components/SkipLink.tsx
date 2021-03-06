import React from 'react';
import styled from 'styled-components';
import { LinkProps, Link, Typography } from '@material-ui/core';

const StyledSkipLink = styled(Link)`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 3rem;
  background: ${({ theme }) => theme.palette.section.black};
  clip-path: circle(0%);

  :focus {
    position: static;
    clip-path: none;
  }
`;

const StyledTypography = styled(Typography)`
  color: ${({ theme }) => theme.palette.background.default};
  outline: 3px solid ${({ theme }) => theme.palette.secondary.main};
  outline-offset: 3px;
`;

export const SkipLink = ({ children, ...props }: LinkProps) => (
  <StyledSkipLink underline="none" {...props}>
    <StyledTypography>{children}</StyledTypography>
  </StyledSkipLink>
);
