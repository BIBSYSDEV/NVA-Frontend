import React, { useState } from 'react';
import { TablePagination } from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import ListSkeleton from '../../components/ListSkeleton';
import { ROWS_PER_PAGE_OPTIONS } from '../../utils/constants';
import { SearchResult } from '../../types/search.types';
import { SearchResults } from './SearchResults';
import { useFetch } from '../../utils/hooks/useFetch';
import { SearchApiPaths } from '../../api/searchApi';

const RegistrationSearch = () => {
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[1]);
  const [page, setPage] = useState(0);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  params.set('results', rowsPerPage.toString());
  params.set('from', (page * rowsPerPage).toString());
  const paramsString = params.toString();
  const [searchResults, isLoadingSearch] = useFetch<SearchResult>(`${SearchApiPaths.REGISTRATIONS}?${paramsString}`);

  return (
    <>
      {isLoadingSearch || !searchResults ? (
        <ListSkeleton arrayLength={3} minWidth={40} height={100} />
      ) : (
        <>
          <SearchResults searchResult={searchResults} />
          {searchResults.hits.length > 0 && (
            <TablePagination
              data-testid="search-pagination"
              rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
              component="div"
              count={searchResults.total}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={(_, newPage) => setPage(newPage)}
              onChangeRowsPerPage={(event) => {
                setRowsPerPage(parseInt(event.target.value));
                setPage(0);
              }}
            />
          )}
        </>
      )}
    </>
  );
};

export default RegistrationSearch;
