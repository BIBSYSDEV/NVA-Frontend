import '../../styles/search.scss';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import SearchIcon from '@material-ui/icons/Search';

import { getResources } from '../../api/resource';
import IconButton from '../IconButton';
import InputBase from '../InputBase';
import Paper from '../Paper';

export interface SearchBarProps {
  history: any;
}

const SearchBar: React.FC<SearchBarProps> = ({ history }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleSearch = () => {
    dispatch(getResources());
    history.push('/Search');
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSearch();
  };

  return (
    <div className="search-bar">
      <Paper>
        <form className="search-bar__search-container" onSubmit={handleSubmit}>
          <InputBase className="search-bar__input" placeholder={t('Search')} />
          <IconButton className="search-bar__search-button" onClick={handleSearch}>
            <SearchIcon />
          </IconButton>
        </form>
      </Paper>
    </div>
  );
};

export default SearchBar;
