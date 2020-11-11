import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import SearchBar from '../../components/SearchBar';

import Search from './Search';

const StyledSearch = styled.div`
  padding-top: 2rem;
  width: 85%;
  justify-items: center;
`;

const SearchPage: FC = () => {
  const history = useHistory();
  const searchTerm = new URLSearchParams(history.location.search).get('query') ?? '';

  const handleSearch = async (searchTerm: string) => {
    if (searchTerm.length) {
      history.push(`/search?query=${searchTerm}`);
    }
  };

  return (
    <StyledSearch>
      <SearchBar
        resetSearchInput={history.location.pathname === '/search'}
        handleSearch={handleSearch}
        initialSearchTerm={searchTerm ?? ''}
      />
      <Search searchTerm={searchTerm} />
    </StyledSearch>
  );
};

export default SearchPage;
