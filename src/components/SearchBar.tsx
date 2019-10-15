import '../styles/search.scss';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import { IconButton, InputBase, Paper } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

import { search } from '../api/resource';

const SearchBar: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    if (searchTerm.length > 0) {
      dispatch(search(searchTerm));
      history.push(`/Search/${searchTerm}`);
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
        <form className="search-bar__search-container" onSubmit={handleSubmit}>
          <InputBase
            data-cy="search-input"
            className="search-bar__input"
            placeholder={t('Search')}
            onChange={handleChange}
          />
          <IconButton data-cy="search-button" className="search-bar__search-button" onClick={handleSearch}>
            <SearchIcon />
          </IconButton>
        </form>
      </Paper>
    </div>
  );
};

export default SearchBar;
