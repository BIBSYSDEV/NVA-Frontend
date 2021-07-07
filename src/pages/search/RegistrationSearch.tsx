import React, { useState } from 'react';
import { TablePagination } from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import { ListSkeleton } from '../../components/ListSkeleton';
import { ROWS_PER_PAGE_OPTIONS } from '../../utils/constants';
import { SearchResult } from '../../types/search.types';
import { SearchResults } from './SearchResults';
import { useFetch } from '../../utils/hooks/useFetch';
import { SearchApiPath } from '../../api/apiPaths';

export const RegistrationSearch = () => {
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[1]);
  const [page, setPage] = useState(0);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  params.set('results', rowsPerPage.toString());
  params.set('from', (page * rowsPerPage).toString());
  const paramsString = params.toString();
  const [searchResults, isLoadingSearch] = useFetch<SearchResult>({
    url: `${SearchApiPath.Registrations}?${paramsString}`,
  });

  return (
    <>
      {isLoadingSearch ? (
        <ListSkeleton arrayLength={3} minWidth={40} height={100} />
      ) : searchResults ? (
        <>
          <SearchResults searchResult={searchResults} />
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
      ) : null}
    </>
  );
};
