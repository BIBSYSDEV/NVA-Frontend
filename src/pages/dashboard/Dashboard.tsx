import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import styled from 'styled-components';

import { search } from '../../api/publicationApi';
import SearchBar from '../../components/SearchBar';
import NormalText from '../../components/NormalText';

const StyledDashboard = styled.div`
  width: 100%;
  height: 85%;
  display: grid;
  grid-template-areas: 'other-content' 'search-bar';
  grid-template-rows: 4rem 15rem auto;
  justify-items: center;
  align-items: center;
`;

const StyledSearchBar = styled(SearchBar)`
  grid-area: search-bar;
`;

const StyledOtherContent = styled(NormalText)`
  grid-area: other-content;
`;

const StyledSearchBarContainer = styled.div`
  width: 35rem;
`;

const Dashboard: FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const handleSearch = async (searchTerm: string) => {
    if (searchTerm.length) {
      await search(searchTerm, dispatch);
      history.push(`/search/${searchTerm}`);
    }
  };

  return (
    <StyledDashboard>
      <StyledSearchBarContainer>
        <StyledSearchBar resetSearchInput handleSearch={handleSearch} />
      </StyledSearchBarContainer>
      <StyledOtherContent>Annet innhold</StyledOtherContent>
    </StyledDashboard>
  );
};

export default Dashboard;
