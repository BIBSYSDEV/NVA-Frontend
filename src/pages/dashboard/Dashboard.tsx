import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import styled from 'styled-components';

import { search } from '../../api/publicationApi';
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

const StyledSearchBarContainer = styled.div`
  width: 35rem;
`;

const Dashboard: FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async () => {
    if (searchTerm.length) {
      await search(searchTerm, dispatch);
      history.push(`/search/${searchTerm}`);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <StyledDashboard>
      <StyledSearchBarContainer>
        <StyledSearchBar
          resetSearchInput
          handleSearch={handleSearch}
          handleChange={handleChange}
          searchTerm={searchTerm}
        />
      </StyledSearchBarContainer>
      <StyledOtherContent>Annet innhold</StyledOtherContent>
    </StyledDashboard>
  );
};

export default Dashboard;
