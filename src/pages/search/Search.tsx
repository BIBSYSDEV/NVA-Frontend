import { CircularProgress } from '@material-ui/core';
import React, { FC, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import SearchBar from '../../components/SearchBar';
import { StyledProgressWrapper } from '../../components/styled/Wrappers';
import useSearchPublications from '../../utils/hooks/useSearchPublications';
import SearchResults from './SearchResults';

const StyledSearch = styled.div`
  padding-top: 2rem;
  width: 80%;
  justify-items: center;
`;

const Search: FC = () => {
  const history = useHistory();
  const [resetSearchInput, setResetSearchInput] = useState(false);
  const searchTerm = new URLSearchParams(history.location.search).get('search');
  const [publications, isLoading] = useSearchPublications(searchTerm);

  const handleSearch = async (searchTerm: string) => {
    if (searchTerm.length) {
      history.push(`/search?search=${searchTerm}`);
    }
  };

  useEffect(() => {
    if (history.location.pathname === '/search') {
      setResetSearchInput(true);
    } else {
      setResetSearchInput(false);
    }
  }, [history.location.pathname]);

  return (
    <StyledSearch>
      <SearchBar resetSearchInput={resetSearchInput} handleSearch={handleSearch} />
      {isLoading ? (
        <StyledProgressWrapper>
          <CircularProgress />
        </StyledProgressWrapper>
      ) : (
        publications?.length > 0 && <SearchResults publications={publications} searchTerm={searchTerm} />
      )}
    </StyledSearch>
  );
};

export default Search;
