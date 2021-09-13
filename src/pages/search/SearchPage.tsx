import { List, Typography } from '@material-ui/core';
import { Formik, Form } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { PageHeader } from '../../components/PageHeader';
import { SearchBar } from '../../components/SearchBar';
import { StyledPageWrapperWithMaxWidth } from '../../components/styled/Wrappers';
import { createSearchConfigFromSearchParams, createSearchQuery } from '../../utils/searchHelpers';
import { RegistrationTypeFilter } from './filters/RegistrationTypeFilter';
import { RegistrationSearch } from './RegistrationSearch';
import { SortSelector } from './SortSelector';

const StyledSearch = styled.div`
  display: grid;
  grid-template-columns: 2fr 5fr 2fr;
  grid-template-rows: auto 1fr;
  grid-template-areas: 'filters searchbar sorting' 'filters results results';
  column-gap: 2rem;
  row-gap: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    grid-template-columns: 1fr;
    grid-template-areas: 'searchbar' 'sorting' 'filters' 'results';
  }
`;

const StyledFilters = styled(List)`
  grid-area: filters;
`;

const StyledFilterHelperText = styled(Typography)`
  font-weight: 500;
`;

const SearchPage = () => {
  const { t } = useTranslation('common');
  const history = useHistory();
  const params = new URLSearchParams(history.location.search);

  const initialSearchParams = createSearchConfigFromSearchParams(params);

  return (
    <StyledPageWrapperWithMaxWidth>
      <PageHeader backPath="/">{t('registrations')}</PageHeader>
      <Formik
        initialValues={initialSearchParams}
        onSubmit={(values) => {
          const queryString = createSearchQuery(values);
          if (queryString) {
            params.set('query', queryString);
          } else {
            params.delete('query');
          }
          history.push({ search: params.toString() });
        }}>
        <Form>
          <StyledSearch>
            <StyledFilters>
              <StyledFilterHelperText>{t('search:select_filters')}</StyledFilterHelperText>
              <RegistrationTypeFilter />
            </StyledFilters>
            <SearchBar />
            <SortSelector />
            <RegistrationSearch />
          </StyledSearch>
        </Form>
      </Formik>
    </StyledPageWrapperWithMaxWidth>
  );
};

export default SearchPage;
