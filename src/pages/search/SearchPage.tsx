import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import SearchBar from '../../components/SearchBar';
import RegistrationSearch from './RegistrationSearch';

const StyledSearch = styled.div`
  width: 85%;
  justify-items: center;
`;

const SearchPage: FC = () => {
  const history = useHistory();
  const searchTerm = new URLSearchParams(history.location.search).get('query') ?? '';

  const handleSearch = (searchTerm: string) => {
    if (searchTerm.length) {
      history.push(`/search?query=${searchTerm}`);
    }
  };

  return (
    <StyledSearch>
      <SearchBar handleSearch={handleSearch} initialSearchTerm={searchTerm} />
      <RegistrationSearch searchTerm={searchTerm} />
    </StyledSearch>
  );
};

export default SearchPage;
