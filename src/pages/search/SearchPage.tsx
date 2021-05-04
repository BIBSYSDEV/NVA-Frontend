import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { PageHeader } from '../../components/PageHeader';
import SearchBar from '../../components/SearchBar';
import { StyledPageWrapperWithMaxWidth } from '../../components/styled/Wrappers';
import { RegistrationFilters } from './RegistrationFilters';
import RegistrationSearch from './RegistrationSearch';

const StyledSearch = styled.div`
  width: 85%;
  justify-items: center;
`;

const SearchPage = () => {
  const { t } = useTranslation('common');
  const history = useHistory();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchQuery = params.get('query') ?? '';

  const handleSearch = (searchTerm: string) => {
    if (searchTerm.length) {
      params.set('query', searchTerm);
    } else {
      params.delete('query');
    }
    history.push({ search: params.toString() });
  };

  return (
    <StyledPageWrapperWithMaxWidth>
      <PageHeader backPath="/">{t('registrations')}</PageHeader>
      <StyledSearch>
        <SearchBar handleSearch={handleSearch} initialSearchTerm={searchQuery} />
        <RegistrationFilters />
        <RegistrationSearch searchTerm={searchQuery} />
      </StyledSearch>
    </StyledPageWrapperWithMaxWidth>
  );
};

export default SearchPage;
