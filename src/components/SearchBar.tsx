import '../styles/pages/search.scss';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import { IconButton, InputBase, Paper } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

import { search } from '../api/resource';

export interface SearchBarProps {
  resetSearchInput: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ resetSearchInput: resetSearch }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (resetSearch) {
      setSearchTerm('');
    }
  }, [resetSearch]);

  const handleSearch = () => {
    if (searchTerm.length > 0) {
      dispatch(search(searchTerm));
      history.push(`/search/${searchTerm}`);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSearch();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="search-bar">
      <Paper>
        <form className="container" onSubmit={handleSubmit}>
          <InputBase
            autoFocus
            data-cy="search-input"
            className="input"
            placeholder={t('Search')}
            onChange={handleChange}
            value={searchTerm}
          />
          <IconButton data-cy="search-button" className="search-button" onClick={handleSearch}>
            <SearchIcon />
          </IconButton>
        </form>
      </Paper>
    </div>
  );
};

export default SearchBar;
