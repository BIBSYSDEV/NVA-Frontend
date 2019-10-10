import '../../styles/search.scss';

import React from 'react';
import { useSelector } from 'react-redux';

import SearchBar from '../../components/search/SearchBar';
import { RootStore } from '../../reducers/rootReducer';
import SearchResults from './SearchResults';

const Search: React.FC = () => {
  const resources = useSelector((state: RootStore) => state.resources);

  return (
    <div className="search">
      <SearchBar />
      {resources && resources.length > 0 && <SearchResults resources={resources} />}
    </div>
  );
};

export default Search;
