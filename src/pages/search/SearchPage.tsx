import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/PageHeader';
import { SearchBar } from '../../components/SearchBar';
import { StyledPageWrapperWithMaxWidth } from '../../components/styled/Wrappers';
import { RegistrationSearch } from './RegistrationSearch';

const SearchPage = () => {
  const { t } = useTranslation('common');

  return (
    <StyledPageWrapperWithMaxWidth>
      <PageHeader backPath="/">{t('registrations')}</PageHeader>
      <SearchBar />
      <RegistrationSearch />
    </StyledPageWrapperWithMaxWidth>
  );
};

export default SearchPage;
