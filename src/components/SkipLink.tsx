import React from 'react';
import styled from 'styled-components';
import { ButtonProps, Link } from '@material-ui/core';

const StyledSkipLink = styled(Link)`
  text-align: center;
  position: absolute;
  :focus {
    position: static;
  }
`;

export const SkipLink = ({ href, children }: ButtonProps) => <StyledSkipLink href={href}>{children}</StyledSkipLink>;
