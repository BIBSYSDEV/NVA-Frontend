import '../../styles/pages/search.scss';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import SearchBar from '../../components/SearchBar';
import { clearSearch } from '../../redux/actions/resourceActions';
import { RootStore } from '../../redux/reducers/rootReducer';
import SearchResults from './SearchResults';

const Search: React.FC = () => {
  const searchResults = useSelector((state: RootStore) => state.results);
  const { resources, searchTerm } = searchResults;
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
    <div className="search">
      <div className="search-container">
        <SearchBar resetSearchInput={resetSearchInput} />
        {resources && resources.length > 0 && <SearchResults resources={resources} searchTerm={searchTerm} />}
      </div>
      <div className="filter-container">filter</div>
    </div>
  );
};

export default Search;
