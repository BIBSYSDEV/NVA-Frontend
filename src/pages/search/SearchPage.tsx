import { List } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { PageHeader } from '../../components/PageHeader';
import { SearchBar } from '../../components/SearchBar';
import { StyledPageWrapperWithMaxWidth } from '../../components/styled/Wrappers';
import { getSearchPath } from '../../utils/urlPaths';
import { RegistrationTypeFilter } from './filters/RegistrationTypeFilter';
import { RegistrationSearch } from './RegistrationSearch';

const StyledSearch = styled.div`
  display: grid;
  grid-template-columns: 1fr 5fr;
  grid-template-areas: '. searchbar' 'filters results';
  column-gap: 3rem;

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

const SearchPage = () => {
  const { t } = useTranslation('common');
  const history = useHistory();
  const searchTerm = new URLSearchParams(history.location.search).get('query') ?? '';

  const handleSearch = (searchTerm: string) => {
    if (searchTerm.length) {
      history.push(getSearchPath(searchTerm));
    }
  };

  return (
    <StyledPageWrapperWithMaxWidth>
      <PageHeader backPath="/">{t('registrations')}</PageHeader>
      <StyledSearch>
        <StyledFilters>
          <RegistrationTypeFilter />
        </StyledFilters>
        <StyledSearchBar handleSearch={handleSearch} initialSearchTerm={searchTerm} />
        <StyledRegistrationSearch searchConfig={{ searchTerm }} />
      </StyledSearch>
    </StyledPageWrapperWithMaxWidth>
  );
};

export default SearchPage;
