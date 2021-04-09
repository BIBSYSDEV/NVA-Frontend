import React from 'react';
import styled from 'styled-components';
import { Button, ButtonProps } from '@material-ui/core';

const StyledButton = styled(Button)`
  width: fit-content;
  align-self: center;
  position: absolute;
  overflow: hidden;
  :focus {
    position: static;
  }
`;

export const SkipLink = ({ href, children }: ButtonProps) => <StyledButton href={href}>{children}</StyledButton>;
