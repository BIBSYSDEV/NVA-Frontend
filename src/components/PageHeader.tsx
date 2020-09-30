import React, { FC } from 'react';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';

const StyledHeader = styled(Typography)`
  width: 85vw;
  border-bottom: 3px solid;
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
`;

export const PageHeader: FC = ({ children }) => <StyledHeader variant="h1">{children}</StyledHeader>;
