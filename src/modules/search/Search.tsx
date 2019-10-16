import '../../styles/search.scss';

import React from 'react';
import { useSelector } from 'react-redux';

import SearchBar from '../../components/SearchBar';
import { RootStore } from '../../reducers/rootReducer';
import SearchResults from './SearchResults';

const Search: React.FC = () => {
  const searchResults = useSelector((state: RootStore) => state.results);
  const { resources, searchTerm } = searchResults;

  return (
    <div className="search">
      <div className="search-container">
        <SearchBar />
        {resources && resources.length > 0 && <SearchResults resources={resources} searchTerm={searchTerm} />}
      </div>
      <div className="filter-container">filter</div>
    </div>
  );
};

export default Search;
