import '../../styles/pages/search.scss';

import React, { Dispatch } from 'react';

import SearchBar from '../../components/SearchBar';
import { SearchActions } from '../../redux/actions/searchActions';
import { SearchResult } from '../../types/search.types';
import SearchResults from './SearchResults';

interface SearchProps {
  dispatchSearch: Dispatch<SearchActions>;
  resetSearch?: boolean;
  searchResults: SearchResult;
}
const Search: React.FC<SearchProps> = ({ dispatchSearch, resetSearch, searchResults }) => {
  const { resources } = searchResults;

  return (
    <div className="search">
      <div className="search-container">
        <SearchBar resetSearchInput={resetSearch || false} dispatchSearch={dispatchSearch} />
        {!resetSearch && resources && resources.length > 0 && (
          <SearchResults dispatchSearch={dispatchSearch} searchResults={searchResults} />
        )}
      </div>
      <div className="filter-container">filter</div>
    </div>
  );
};

export default Search;
