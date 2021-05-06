import React, { useEffect, useState } from 'react';
import { ListSubheader, MenuItem, TextField, Typography, IconButton, Button, Collapse } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { JournalType, BookType, ReportType, DegreeType, ChapterType } from '../types/publicationFieldNames';
import { SearchFieldName } from '../types/search.types';

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
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(true);

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
        <Button onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}>Avansert søk</Button>
      </StyledFilterRow>
      <Collapse in={showAdvancedSearch}>
        <AdvancedSearch params={params} />
      </Collapse>
    </form>
  );
};

const StyledAdvancedSearchRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 5fr 1fr;
  gap: 1rem;
`;

interface AdvancedSearchProps {
  params: URLSearchParams;
}

const AdvancedSearch = ({ params }: AdvancedSearchProps) => {
  const history = useHistory();
  const [filters, setFilters] = useState(''); //TODO default value

  console.log(filters);
  return (
    <>
      <AdvancedSearchRow
        updateFilter={(newFilter) => {
          setFilters(newFilter);
        }}
        filter={filters}
      />

      <Button
        variant="contained"
        onClick={() => {
          const [newKey, newValue] = filters.split('=');
          const newParams = params;
          newParams.set(newKey, newValue);
          history.push({ search: newParams.toString() });
        }}>
        SØK
      </Button>
    </>
  );
};

enum Operator {
  Equals,
  Includes,
}

interface AdvancedSearchRowProps {
  updateFilter: (newFilter: string) => void;
  filter: string;
}

const AdvancedSearchRow = ({ updateFilter, filter }: AdvancedSearchRowProps) => {
  const [field, setField] = useState(SearchFieldName.Title);
  const [operator, setOperator] = useState(
    (filter.match(/\*/g) || []).length === 2 ? Operator.Includes : Operator.Equals
  );
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value) {
      const newFilter = operator === Operator.Equals ? `${field}="${value}"` : `${field}="*${value}*"`;
      updateFilter(newFilter);
    }
  }, [updateFilter, value, field, operator]);

  return (
    <StyledAdvancedSearchRow>
      <TextField
        select
        variant="outlined"
        label="Felt"
        value={field}
        onChange={(event) => setField(event.target.value as SearchFieldName)}>
        <MenuItem value={SearchFieldName.Title}>{SearchFieldName.Title}</MenuItem>
        <MenuItem value={SearchFieldName.Abstract}>{SearchFieldName.Abstract}</MenuItem>
      </TextField>
      <TextField
        select
        variant="outlined"
        label="Operator"
        value={operator}
        onChange={(event) => setOperator((event.target.value as unknown) as Operator)}>
        <MenuItem value={Operator.Equals}>Er lik</MenuItem>
        <MenuItem value={Operator.Includes}>Inneholder</MenuItem>
      </TextField>
      <TextField
        variant="outlined"
        label="Verdi"
        InputLabelProps={{ shrink: true }}
        value={value}
        onChange={(event) => setValue(event.target.value)}></TextField>
    </StyledAdvancedSearchRow>
  );
};
