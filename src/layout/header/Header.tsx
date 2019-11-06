import React from 'react';
import Login from './Login';
import Logo from './Logo';
import styled from 'styled-components';

const PageHeader = styled.div`
  display: grid;
  grid-template-areas: 'logo auth';
  grid-template-columns: 5rem auto;
  font-weight: bold;
  align-items: center;
  padding-left: 1rem;
  padding-right: 1rem;
  border-bottom: 2px solid ${props => props.theme.palette.seperator.main};
  min-height: 4rem;
`;

const Header: React.FC = () => (
  <PageHeader>
    <Logo />
    <Login />
  </PageHeader>
);

export default Header;
