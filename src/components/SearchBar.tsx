import React, { useEffect, useState } from 'react';
import { ListSubheader, MenuItem, TextField, Typography, IconButton, Button, Collapse } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { JournalType, BookType, ReportType, DegreeType, ChapterType } from '../types/publicationFieldNames';
import { SearchFieldName } from '../types/search.types';
import { Field, FieldProps, Form, Formik, useFormikContext } from 'formik';

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

enum Operator {
  Equals,
  Includes,
}

interface SearchValues {
  query: string;
  advanced: AdvancedFilter[];
}

interface AdvancedFilter {
  field: string;
  operator: Operator;
  value: string;
}

const intialSearchValues: SearchValues = {
  query: '',
  advanced: [],
};

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
    <Formik
      initialValues={intialSearchValues}
      onSubmit={(values) => {
        console.log('submit', values);
      }}>
      <Form>
        <Field name="query">
          {({ field }: FieldProps<string>) => (
            <TextField
              {...field}
              id={field.name}
              data-testid="search-field"
              autoFocus
              fullWidth
              variant="outlined"
              label={t('common:search')}
              InputProps={{
                endAdornment: (
                  <IconButton type="submit" data-testid="search-button" title={t('search')}>
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
          )}
        </Field>

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
      </Form>
    </Formik>
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
  const { values, setFieldValue } = useFormikContext<SearchValues>();

  const addAdvancedFilter = () => {
    const newAdvanced: AdvancedFilter[] = [...values.advanced, { field: '', operator: Operator.Includes, value: '' }];
    setFieldValue('advanced', newAdvanced);
  };

  return (
    <>
      {values.advanced.map((_, index) => (
        <AdvancedSearchRow key={index} index={index} />
      ))}
      <Button variant="outlined" onClick={addAdvancedFilter}>
        Legg til filter
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          console.log('SØK', values);
        }}>
        SØK
      </Button>
    </>
  );
};

interface AdvancedSearchRowProps {
  index: number;
}

const AdvancedSearchRow = ({ index }: AdvancedSearchRowProps) => {
  const { values, setFieldValue } = useFormikContext<SearchValues>();

  return (
    <StyledAdvancedSearchRow>
      <Field name={`advanced[${index}].field`}>
        {({ field }: FieldProps<string>) => (
          <TextField {...field} select variant="outlined" label="Felt">
            <MenuItem value={SearchFieldName.Title}>{SearchFieldName.Title}</MenuItem>
            <MenuItem value={SearchFieldName.Abstract}>{SearchFieldName.Abstract}</MenuItem>
          </TextField>
        )}
      </Field>
      <Field name={`advanced[${index}].operator`}>
        {({ field }: FieldProps<string>) => (
          <TextField {...field} select variant="outlined" label="Operator">
            <MenuItem value={Operator.Equals}>Er lik</MenuItem>
            <MenuItem value={Operator.Includes}>Inneholder</MenuItem>
          </TextField>
        )}
      </Field>
      <Field name={`advanced[${index}].value`}>
        {({ field }: FieldProps<string>) => (
          <TextField {...field} variant="outlined" label="Verdi" InputLabelProps={{ shrink: true }} />
        )}
      </Field>
      <Button
        onClick={() => {
          const advancedCopy = [...values.advanced];
          advancedCopy.splice(index, 1);
          setFieldValue('advanced', advancedCopy);
        }}>
        Fjern filter
      </Button>
    </StyledAdvancedSearchRow>
  );
};
