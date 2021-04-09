import React from 'react';
import styled from 'styled-components';
import { LinkProps, Link } from '@material-ui/core';

const StyledSkipLink = styled(Link)`
  text-align: center;
  position: absolute;

  &.Mui-focusVisible {
    position: static;
  }
`;

export const SkipLink = (props: LinkProps) => <StyledSkipLink {...props} />;
