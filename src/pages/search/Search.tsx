import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import SearchBar from '../../components/SearchBar';
import useSearchPublications from '../../utils/hooks/useSearchPublications';
import SearchResults from './SearchResults';
import ListSkeleton from '../../components/ListSkeleton';

const StyledSearch = styled.div`
  padding-top: 2rem;
  width: 80%;
  justify-items: center;
`;

const Search: FC = () => {
  const history = useHistory();
  const searchTerm = new URLSearchParams(history.location.search).get('query');
  const [publications, isLoading] = useSearchPublications(searchTerm);

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
      {isLoading ? (
        <ListSkeleton arrayLength={5} minWidth={40} height={100} />
      ) : (
        publications?.length > 0 && <SearchResults publications={publications} searchTerm={searchTerm} />
      )}
    </StyledSearch>
  );
};

export default Search;
