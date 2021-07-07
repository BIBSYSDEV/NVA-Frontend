import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { PageHeader } from '../../components/PageHeader';
import { SearchBar } from '../../components/SearchBar';
import { StyledPageWrapperWithMaxWidth } from '../../components/styled/Wrappers';
import { getSearchPath } from '../../utils/urlPaths';
import { RegistrationSearch } from './RegistrationSearch';

const StyledSearch = styled.div`
  display: grid;
  grid-template-columns: 1fr 5fr;
  grid-template-areas: '. searchbar' 'filters results';
  column-gap: 2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    grid-template-columns: 1fr;
    grid-template-areas: 'searchbar' 'filters' 'results';
  }
`;
const StyledSearchBar = styled(SearchBar)`
  grid-area: searchbar;
`;

const StyledFilters = styled.div`
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
        <StyledFilters>{/* TODO */}</StyledFilters>
        <StyledSearchBar handleSearch={handleSearch} initialSearchTerm={searchTerm} />
        <StyledRegistrationSearch searchConfig={{ searchTerm }} />
      </StyledSearch>
    </StyledPageWrapperWithMaxWidth>
  );
};

export default SearchPage;
