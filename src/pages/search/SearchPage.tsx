import { List, Typography } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { PageHeader } from '../../components/PageHeader';
import { SearchBar } from '../../components/SearchBar';
import { StyledPageWrapperWithMaxWidth } from '../../components/styled/Wrappers';
import { createSearchConfigFromSearchParams } from '../../utils/searchHelpers';
import { getSearchPath } from '../../utils/urlPaths';
import { RegistrationTypeFilter } from './filters/RegistrationTypeFilter';
import { RegistrationSearch } from './RegistrationSearch';

const StyledSearch = styled.div`
  display: grid;
  grid-template-columns: 2fr 7fr;
  grid-template-rows: auto 1fr;
  grid-template-areas: 'filters searchbar' 'filters results';
  column-gap: 2rem;
  row-gap: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    grid-template-columns: 1fr;
    grid-template-areas: 'searchbar' 'filters' 'results';
  }
`;
const StyledSearchBar = styled(SearchBar)`
  grid-area: searchbar;
`;

const StyledFilters = styled(List)`
  grid-area: filters;
`;

const StyledRegistrationSearch = styled(RegistrationSearch)`
  grid-area: results;
`;

const StyledFilterHelperText = styled(Typography)`
  font-weight: 500;
`;

const SearchPage = () => {
  const { t } = useTranslation('common');
  const history = useHistory();
  const params = new URLSearchParams(history.location.search);
  // const searchTerm = new URLSearchParams(history.location.search).get('query') ?? '';

  const searchParams = createSearchConfigFromSearchParams(params);
  console.log(searchParams);

  const handleSearch = (searchTerm: string) => {
    if (searchParams.searchTerm) {
      history.push(getSearchPath(searchParams.searchTerm));
    }
  };

  return (
    <StyledPageWrapperWithMaxWidth>
      <PageHeader backPath="/">{t('registrations')}</PageHeader>
      <StyledSearch>
        <StyledFilters>
          <StyledFilterHelperText>{t('select_filters')}</StyledFilterHelperText>
          <RegistrationTypeFilter />
        </StyledFilters>
        <StyledSearchBar handleSearch={handleSearch} initialSearchTerm={searchParams.searchTerm} />
        <StyledRegistrationSearch searchConfig={{ searchTerm: searchParams.searchTerm }} />
      </StyledSearch>
    </StyledPageWrapperWithMaxWidth>
  );
};

export default SearchPage;
