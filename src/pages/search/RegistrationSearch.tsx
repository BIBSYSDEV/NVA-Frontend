import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TablePagination, Typography } from '@material-ui/core';
import { ListSkeleton } from '../../components/ListSkeleton';
import { ROWS_PER_PAGE_OPTIONS } from '../../utils/constants';
import { useSearchRegistrations } from '../../utils/hooks/useSearchRegistrations';
import { SearchResults } from './SearchResults';
import { createSearchConfigFromSearchParams, SearchConfig } from '../../utils/searchHelpers';
import { useLocation } from 'react-router-dom';
import { SearchApiPath } from '../../api/apiPaths';
import { SearchResult } from '../../types/search.types';
import { useFetch } from '../../utils/hooks/useFetch';

interface RegistrationSearchProps {
  searchConfig?: SearchConfig;
  noHitsText?: string;
}

export const RegistrationSearch = ({ searchConfig, noHitsText, ...props }: RegistrationSearchProps) => {
  const { t } = useTranslation('common');
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[1]);
  const [page, setPage] = useState(0);
  // const [searchResults, isLoadingSearch] = useSearchRegistrations(searchConfig, rowsPerPage, page * rowsPerPage);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  params.set('results', rowsPerPage.toString());
  params.set('from', (page * rowsPerPage).toString());
  const paramsString = params.toString();

  const url = `${SearchApiPath.Registrations}?${paramsString}`;
  const [searchResults, isLoadingSearch] = useFetch<SearchResult>({ url });

  return (
    <div {...props}>
      {isLoadingSearch ? (
        <ListSkeleton arrayLength={3} minWidth={40} height={100} />
      ) : searchResults && searchResults.hits.length > 0 ? (
        <>
          <SearchResults searchResult={searchResults} searchTerm={searchConfig?.searchTerm} />
          <TablePagination
            data-testid="search-pagination"
            rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
            component="div"
            count={searchResults.total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value));
              setPage(0);
            }}
          />
        </>
      ) : (
        <Typography>{noHitsText ? noHitsText : t('no_hits')}</Typography>
      )}
    </div>
  );
};
