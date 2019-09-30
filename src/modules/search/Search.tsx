import '../../styles/search.scss';

import React from 'react';
import { useSelector } from 'react-redux';

import { RootStore } from '../../reducers/rootReducer';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';

export interface SearchProps {
  history: any;
}

const Search: React.FC<SearchProps> = ({ history }) => {
  const resources = useSelector((state: RootStore) => state.resources);

  return (
    <div className="search">
      <SearchBar history={history} />
      {resources && resources.length > 0 && <SearchResults resources={resources} />}
    </div>
  );
};

export default Search;
