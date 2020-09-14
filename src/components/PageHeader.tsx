import React, { FC } from 'react';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';

const StyledHeader = styled(Typography)`
  width: 90vw;
  border-bottom: 2px solid;
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
`;

export const PageHeader: FC = ({ children }) => <StyledHeader variant="h1">{children}</StyledHeader>;
