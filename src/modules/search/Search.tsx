import '../../styles/search.scss';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { clearSearch } from '../../actions/resourceActions';
import SearchBar from '../../components/SearchBar';
import { RootStore } from '../../reducers/rootReducer';
import SearchResults from './SearchResults';

const Search: React.FC = () => {
  const searchResults = useSelector((state: RootStore) => state.results);
  const { resources, searchTerm } = searchResults;
  const dispatch = useDispatch();
  const history = useHistory();
  const [resetSearch, setResetSearch] = useState(false);

  useEffect(() => {
    if (history.location.pathname === '/Search') {
      dispatch(clearSearch());
      setResetSearch(true);
    } else {
      setResetSearch(false);
    }
  }, [dispatch, history.location.pathname]);

  return (
    <div className="search">
      <div className="search-container">
        <SearchBar resetSearch={resetSearch} />
        {resources && resources.length > 0 && <SearchResults resources={resources} searchTerm={searchTerm} />}
      </div>
      <div className="filter-container">filter</div>
    </div>
  );
};

export default Search;
