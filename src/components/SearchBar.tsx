import React, { useState } from 'react';
import { ListSubheader, MenuItem, TextField, Typography, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { JournalType, BookType, ReportType, DegreeType, ChapterType } from '../types/publicationFieldNames';

const StyledSelect = styled(TextField)`
  margin-top: 0rem;
  width: 13rem;
`;

const StyledFilterRow = styled.div`
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;

  > :not(:first-child) {
    margin-left: 1rem;
  }
`;

export enum RegistrationSearchParamKey {
  Query = 'query',
  Type = 'type',
}

export const SearchBar = () => {
  const { t } = useTranslation('publicationTypes');
  const history = useHistory();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paramQuery = params.get(RegistrationSearchParamKey.Query) ?? '';
  const paramType = params.get(RegistrationSearchParamKey.Type) ?? '';
  const [searchTerm, setSearchTerm] = useState(paramQuery);

  const updateSearchParam = (key: RegistrationSearchParamKey, value?: string) => {
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    history.push({ search: params.toString() });
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        updateSearchParam(RegistrationSearchParamKey.Query, searchTerm);
      }}>
      <TextField
        id="search-field"
        data-testid="search-field"
        autoFocus
        fullWidth
        variant="outlined"
        label={t('common:search')}
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
      <StyledFilterRow>
        <Typography variant="subtitle2" component="p">
          {t('common:filter')}:
        </Typography>
        <StyledSelect
          value={paramType}
          variant="filled"
          label={t('common:registration_type')}
          select
          onChange={(event) => updateSearchParam(RegistrationSearchParamKey.Type, event.target.value)}>
          <MenuItem value="">
            <em>{t('common:none')}</em>
          </MenuItem>
          <ListSubheader disableSticky>{t('Journal')}</ListSubheader>
          {Object.values(JournalType).map((type) => (
            <MenuItem key={type} value={type}>
              {t(type)}
            </MenuItem>
          ))}
          <ListSubheader disableSticky>{t('Book')}</ListSubheader>
          {Object.values(BookType).map((type) => (
            <MenuItem key={type} value={type}>
              {t(type)}
            </MenuItem>
          ))}
          <ListSubheader disableSticky>{t('Report')}</ListSubheader>
          {Object.values(ReportType).map((type) => (
            <MenuItem key={type} value={type}>
              {t(type)}
            </MenuItem>
          ))}
          <ListSubheader disableSticky>{t('Degree')}</ListSubheader>
          {Object.values(DegreeType).map((type) => (
            <MenuItem key={type} value={type}>
              {t(type)}
            </MenuItem>
          ))}
          <ListSubheader disableSticky>{t('Chapter')}</ListSubheader>
          {Object.values(ChapterType).map((type) => (
            <MenuItem key={type} value={type}>
              {t(type)}
            </MenuItem>
          ))}
        </StyledSelect>
      </StyledFilterRow>
    </form>
  );
};
