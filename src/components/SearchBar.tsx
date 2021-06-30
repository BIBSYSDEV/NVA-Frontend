import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { IconButton, TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

const StyledTextField = styled(TextField)`
  margin-bottom: 1rem;
`;

interface SearchBarProps {
  handleSearch: (searchTerm: string) => void;
  initialSearchTerm?: string;
}

const SearchBar = ({ handleSearch, initialSearchTerm = '' }: SearchBarProps) => {
  const { t } = useTranslation('common');
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        handleSearch(searchTerm);
      }}>
      <StyledTextField
        id="search-field"
        data-testid="search-field"
        autoFocus
        fullWidth
        variant="outlined"
        label={t('search')}
        onChange={(event) => setSearchTerm(event.target.value)}
        value={searchTerm}
        InputProps={{
          endAdornment: (
            <IconButton type="submit" data-testid="search-button" title={t('search')}>
              <SearchIcon />
            </IconButton>
          ),
        }}
      />
    </form>
  );
};

export default SearchBar;
