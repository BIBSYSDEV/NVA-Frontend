import React, { FC } from 'react';

import useSearchRegistrations from '../../utils/hooks/useSearchRegistrations';
import SearchResults from './SearchResults';
import ListSkeleton from '../../components/ListSkeleton';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';

interface SearchProps {
  searchTerm?: string;
  noHitsText?: string;
}

const Search: FC<SearchProps> = ({ searchTerm, noHitsText }) => {
  const [registrationsSearch, isLoadingSearch] = useSearchRegistrations(searchTerm);
  const { t } = useTranslation('common');

  return (
    <>
      {isLoadingSearch || !registrationsSearch ? (
        <ListSkeleton arrayLength={5} minWidth={40} height={100} />
      ) : registrationsSearch.hits.length > 0 ? (
        <SearchResults searchResult={registrationsSearch} searchTerm={searchTerm} />
      ) : noHitsText ? (
        noHitsText
      ) : (
        <Typography>{noHitsText ? noHitsText : t('no_hits')}</Typography>
      )}
    </>
  );
};

export default Search;
