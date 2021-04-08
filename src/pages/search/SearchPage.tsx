import React, { FC } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { PageHeader } from '../../components/PageHeader';
import SearchBar from '../../components/SearchBar';
import { StyledPageWrapperWithMaxWidth } from '../../components/styled/Wrappers';
import { getSearchPath } from '../../utils/urlPaths';
import RegistrationSearch from './RegistrationSearch';

const StyledSearch = styled.div`
  width: 85%;
  justify-items: center;
`;

const SearchPage: FC = () => {
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
      <Helmet>
        <title>{t('registrations')}</title>
      </Helmet>
      <PageHeader backPath="/">{t('registrations')}</PageHeader>
      <StyledSearch>
        <SearchBar handleSearch={handleSearch} initialSearchTerm={searchTerm} />
        <RegistrationSearch searchTerm={searchTerm} />
      </StyledSearch>
    </StyledPageWrapperWithMaxWidth>
  );
};

export default SearchPage;
