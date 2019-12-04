import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import SearchBar from '../../components/SearchBar';
import { clearSearch } from '../../redux/actions/searchActions';
import { RootStore } from '../../redux/reducers/rootReducer';
import SearchResults from './SearchResults';
import styled from 'styled-components';

const StyledSearch = styled.div`
  display: grid;
  grid-template-columns: 10rem auto;
  width: 100%;
  justify-items: center;
`;

const Search: React.FC = () => {
  const searchResults = useSelector((state: RootStore) => state.search);
  const { publications, searchTerm } = searchResults;
  const dispatch = useDispatch();
  const history = useHistory();
  const [resetSearchInput, setResetSearchInput] = useState(false);

  useEffect(() => {
    if (history.location.pathname === '/search') {
      dispatch(clearSearch());
      setResetSearchInput(true);
    } else {
      setResetSearchInput(false);
    }
  }, [dispatch, history.location.pathname]);

  return (
    <StyledSearch>
      <div>filter</div>
      <div>
        <SearchBar resetSearchInput={resetSearchInput} />
        {publications && publications.length > 0 && (
          <SearchResults publications={publications} searchTerm={searchTerm} />
        )}
      </div>
    </StyledSearch>
  );
};

export default Search;
