import React, { useEffect, useState, FormEvent, ChangeEvent, FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { IconButton, InputBase, Paper } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

const StyledPaper = styled(Paper)`
  margin-bottom: 1rem;
`;

const StyledForm = styled.form`
  display: flex;
  justify-content: space-between;
`;

const StyledInputBase = styled(InputBase)`
  margin-left: 1rem;
  width: 90%;
`;

interface SearchBarProps {
  handleSearch: (searchTerm: string) => void;
  resetSearchInput?: boolean;
  initialSearchTerm?: string;
}

const SearchBar: FC<SearchBarProps> = ({ resetSearchInput = true, handleSearch, initialSearchTerm = '' }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  useEffect(() => {
    if (resetSearchInput) {
      setSearchTerm('');
    }
  }, [resetSearchInput]);

  useEffect(() => {
    setSearchTerm(searchTerm);
  }, [searchTerm]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    handleSearch(searchTerm);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
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
