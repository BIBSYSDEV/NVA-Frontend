import React from 'react';
import Login from './Login';
import styled from 'styled-components';

const StyledPageHeader = styled.div`
  display: grid;
  grid-template-areas: 'logo auth';
  grid-template-columns: 5rem auto;
  font-weight: bold;
  align-items: center;
  padding-left: 1rem;
  padding-right: 1rem;
  border-bottom: 2px solid ${({ theme }) => theme.palette.separator.main};
  min-height: 4rem;
`;

const Header: React.FC = () => (
  <StyledPageHeader>
    <Login />
  </StyledPageHeader>
);

export default Header;
