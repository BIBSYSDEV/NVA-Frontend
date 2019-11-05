import '../styles/pages/search.scss';

import React, { Dispatch, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import { IconButton, InputBase, Paper } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

import { search } from '../api/search';
import { SearchActions } from '../redux/actions/searchActions';

export interface SearchBarProps {
  dispatchSearch: Dispatch<SearchActions>;
  resetSearchInput: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ dispatchSearch, resetSearchInput }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    if (resetSearchInput) {
      setSearchTerm('');
    }
  }, [resetSearchInput]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSearch();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    dispatch(search(searchTerm, dispatchSearch));
    history.push(`/search/${searchTerm}`);
  };

  return (
    <div className="search-bar">
      <Paper>
        <form className="container" onSubmit={handleSubmit}>
          <InputBase
            autoFocus
            data-testid="search-input"
            className="input"
            placeholder={t('Search')}
            onChange={handleChange}
            value={searchTerm}
          />
          <IconButton data-testid="search-button" className="search-button" onClick={handleSearch}>
            <SearchIcon />
          </IconButton>
        </form>
      </Paper>
    </div>
  );
};

export default SearchBar;
