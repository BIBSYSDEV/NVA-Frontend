import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import styled from 'styled-components';

import { IconButton, InputBase, Paper } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

import { search } from '../api/searchApi';

interface SearchBarProps {
  resetSearchInput: boolean;
}

const StyledPaper = styled(Paper)`
  margin-bottom: 3rem;
`;

const StyledForm = styled.form`
  display: flex;
  justify-content: space-between;
`;

const StyledInputBase = styled(InputBase)`
  margin-left: 1rem;
  min-width: 50vw;
  max-width: 65vw;
`;

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
    if (searchTerm.length) {
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
    <StyledPaper>
      <StyledForm onSubmit={handleSubmit}>
        <StyledInputBase
          autoFocus
          data-testid="search-input"
          placeholder={t('common:search')}
          onChange={handleChange}
          value={searchTerm}
        />
        <IconButton type="submit" data-testid="search-button">
          <SearchIcon />
        </IconButton>
      </StyledForm>
    </StyledPaper>
  );
};

export default SearchBar;
