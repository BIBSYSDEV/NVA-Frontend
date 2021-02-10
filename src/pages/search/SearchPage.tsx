import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import BackgroundDiv from '../../components/BackgroundDiv';
import { PageHeader } from '../../components/PageHeader';
import SearchBar from '../../components/SearchBar';
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
    <BackgroundDiv>
      <PageHeader backPath="/">{t('registrations')}</PageHeader>
      <StyledSearch>
        <SearchBar handleSearch={handleSearch} initialSearchTerm={searchTerm} />
        <RegistrationSearch searchTerm={searchTerm} />
      </StyledSearch>
    </BackgroundDiv>
  );
};

export default SearchPage;
