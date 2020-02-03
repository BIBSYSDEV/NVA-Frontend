import React, { useEffect, useState } from 'react';
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
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearch: () => void;
  resetSearchInput: boolean;
  searchTerm: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ resetSearchInput, handleSearch, handleChange, searchTerm }) => {
  const { t } = useTranslation();
  const [displayValue, setDisplayValue] = useState(searchTerm);

  useEffect(() => {
    if (resetSearchInput) {
      setDisplayValue('');
    }
  }, [resetSearchInput]);

  useEffect(() => {
    setDisplayValue(searchTerm);
  }, [searchTerm]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSearch();
  };

  return (
    <StyledPaper>
      <StyledForm onSubmit={handleSubmit}>
        <StyledInputBase
          autoFocus
          data-testid="search-input"
          placeholder={t('common:search')}
          onChange={handleChange}
          value={displayValue}
        />
        <IconButton type="submit" data-testid="search-button">
          <SearchIcon />
        </IconButton>
      </StyledForm>
    </StyledPaper>
  );
};

export default SearchBar;
