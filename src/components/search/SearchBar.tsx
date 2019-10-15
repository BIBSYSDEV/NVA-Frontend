import '../../styles/search.scss';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import { InputBase } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

import { search } from '../../api/resource';
import IconButton from '../IconButton';
import Paper from '../Paper';

const SearchBar: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    dispatch(search(searchTerm));
    history.push(`/Search/${searchTerm}`);
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
          <InputBase autoFocus className="search-bar__input" placeholder={t('Search')} onChange={handleChange} />
          <IconButton className="search-bar__search-button" onClick={handleSearch}>
            <SearchIcon />
          </IconButton>
        </form>
      </Paper>
    </div>
  );
};

export default SearchBar;
