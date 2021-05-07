import React, { useState } from 'react';
import { ListSubheader, MenuItem, TextField, Typography, IconButton, Button, Collapse } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Field, FieldArray, FieldArrayRenderProps, FieldProps, Form, Formik, useFormikContext } from 'formik';
import { JournalType, BookType, ReportType, DegreeType, ChapterType } from '../types/publicationFieldNames';
import { SearchFieldName } from '../types/search.types';
import { createSearchQuery, ExpressionStatement, PropertySearch, SearchConfig } from '../utils/searchHelpers';

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

const intialSearchValues: SearchConfig = {
  searchTerm: '',
  properties: [],
};

export const SearchBar = () => {
  const { t } = useTranslation('publicationTypes');
  const history = useHistory();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(true);

  return (
    <Formik
      initialValues={intialSearchValues} // TODO: get values from URL
      onSubmit={(values) => {
        const queryString = createSearchQuery(values);
        params.set('query', queryString);
        history.push({ search: params.toString() });
      }}>
      <Form>
        <Field name="searchTerm">
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
        <FieldArray name="properties">
          {({ push, remove, form: { submitForm } }: FieldArrayRenderProps) => (
            <>
              <StyledFilterRow>
                <Typography variant="subtitle2" component="p">
                  {t('common:filter')}:
                </Typography>

                <StyledSelect
                  value={undefined}
                  variant="filled"
                  label={t('common:registration_type')}
                  select
                  onChange={(event) => {
                    const newPropertyFilter: PropertySearch = {
                      fieldName: SearchFieldName.Subtype,
                      value: event.target.value,
                      operator: ExpressionStatement.Includes,
                    };
                    push(newPropertyFilter);
                    submitForm();
                  }}>
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
                <AdvancedSearch push={push} remove={remove} />
              </Collapse>
            </>
          )}
        </FieldArray>
      </Form>
    </Formik>
  );
};

const StyledAdvancedSearchRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 4fr 1fr;
  gap: 1rem;
`;

interface AdvancedSearchProps {
  push: (obj: PropertySearch) => void;
  remove: (index: number) => void;
}

const AdvancedSearch = ({ push, remove }: AdvancedSearchProps) => {
  const { values } = useFormikContext<SearchConfig>();

  const addAdvancedFilter = () => {
    const newAdvanced: PropertySearch = {
      fieldName: SearchFieldName.Title,
      operator: ExpressionStatement.Includes,
      value: '',
    };
    push(newAdvanced);
  };

  return (
    <>
      {values.properties &&
        values.properties.map((_, index) => <AdvancedSearchRow key={index} index={index} remove={remove} />)}
      <Button variant="outlined" onClick={addAdvancedFilter}>
        Legg til filter
      </Button>
      <Button variant="contained" type="submit">
        SØK
      </Button>
    </>
  );
};

interface AdvancedSearchRowProps {
  index: number;
  remove: (index: number) => void;
}

const AdvancedSearchRow = ({ index, remove }: AdvancedSearchRowProps) => {
  return (
    <StyledAdvancedSearchRow>
      <Field name={`properties[${index}].fieldName`}>
        {({ field }: FieldProps<string>) => (
          <TextField {...field} select variant="outlined" label="Felt">
            <MenuItem value={SearchFieldName.Title}>{SearchFieldName.Title}</MenuItem>
            <MenuItem value={SearchFieldName.Abstract}>{SearchFieldName.Abstract}</MenuItem>
            <MenuItem value={SearchFieldName.Subtype}>{SearchFieldName.Subtype}</MenuItem>
          </TextField>
        )}
      </Field>
      <Field name={`properties[${index}].operator`}>
        {({ field }: FieldProps<string>) => (
          <TextField {...field} select variant="outlined" label="Operator">
            <MenuItem value={ExpressionStatement.Includes}>Inneholder</MenuItem>
            <MenuItem value={ExpressionStatement.Excludes}>Inneholder ikke</MenuItem>
          </TextField>
        )}
      </Field>
      <Field name={`properties[${index}].value`}>
        {({ field }: FieldProps<string>) => (
          <TextField {...field} variant="outlined" label="Verdi" InputLabelProps={{ shrink: true }} />
        )}
      </Field>
      <Button
        onClick={() => {
          remove(index);
        }}>
        Fjern filter
      </Button>
    </StyledAdvancedSearchRow>
  );
};
