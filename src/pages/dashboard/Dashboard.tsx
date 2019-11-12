import React from 'react';
import styled from 'styled-components';

import SearchBar from '../../components/SearchBar';

const StyledDashboard = styled.div`
  width: 100%;
  height: 85%;
  display: grid;
  grid-template-areas: 'search-bar' 'other-content';
  grid-template-rows: 4rem 15rem auto;
  justify-items: center;
  align-items: center;
`;

const StyledSearchBar = styled(SearchBar)`
  grid-area: other-content;
`;

const StyledOtherContent = styled.div`
  grid-area: search-bar;
`;

const Dashboard: React.FC = () => (
  <StyledDashboard>
    <StyledSearchBar resetSearchInput />
    <StyledOtherContent>Annet innhold</StyledOtherContent>
  </StyledDashboard>
);

export default Dashboard;
