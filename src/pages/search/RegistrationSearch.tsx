import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import useSearchRegistrations from '../../utils/hooks/useSearchRegistrations';
import SearchResults from './SearchResults';
import ListSkeleton from '../../components/ListSkeleton';

interface RegistrationSearchProps {
  searchTerm?: string;
  noHitsText?: string;
}

const RegistrationSearch: FC<RegistrationSearchProps> = ({ searchTerm, noHitsText }) => {
  const [registrationsSearch, isLoadingSearch] = useSearchRegistrations({ searchTerm });
  const { t } = useTranslation('common');

  return (
    <>
      {isLoadingSearch ? (
        <ListSkeleton arrayLength={3} minWidth={40} height={100} />
      ) : registrationsSearch && registrationsSearch.hits.length > 0 ? (
        <SearchResults searchResult={registrationsSearch} searchTerm={searchTerm} />
      ) : (
        <Typography>{noHitsText ? noHitsText : t('no_hits')}</Typography>
      )}
    </>
  );
};

export default RegistrationSearch;
