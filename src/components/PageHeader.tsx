import React, { FC } from 'react';
import styled from 'styled-components';

const StyledHeader = styled.h1`
  width: 100%;
  border-bottom: 2px solid;
`;

export const PageHeader: FC = ({ children }) => {
  return <StyledHeader>{children}</StyledHeader>;
};
