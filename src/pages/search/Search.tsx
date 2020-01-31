import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import styled from 'styled-components';

import { search } from '../../api/publicationApi';
import SearchBar from '../../components/SearchBar';
import { clearSearch } from '../../redux/actions/searchActions';
import { RootStore } from '../../redux/reducers/rootReducer';
import SearchResults from './SearchResults';

const StyledSearch = styled.div`
  display: grid;
  grid-template-columns: 10rem auto;
  width: 100%;
  justify-items: center;
`;

const Search: FC = () => {
  const searchResults = useSelector((state: RootStore) => state.search);
  const { publications } = searchResults;
  const dispatch = useDispatch();
  const history = useHistory();
  const [resetSearchInput, setResetSearchInput] = useState(false);
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
        <SearchBar
          resetSearchInput={resetSearchInput}
          searchTerm={searchTerm}
          handleSearch={handleSearch}
          handleChange={handleChange}
        />
        {publications?.length > 0 && <SearchResults publications={publications} searchTerm={searchTerm} />}
      </div>
    </StyledSearch>
  );
};

export default Search;
