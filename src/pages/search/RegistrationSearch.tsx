import React, { useState } from 'react';
import { TablePagination } from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import ListSkeleton from '../../components/ListSkeleton';
import { ROWS_PER_PAGE_OPTIONS } from '../../utils/constants';
import useSearchRegistrations from '../../utils/hooks/useSearchRegistrations';
import { SearchFieldName, SearchResult } from '../../types/search.types';
import { SearchResults } from './SearchResults';
import { useFetch } from '../../utils/hooks/useFetch';
import { SearchApiPaths } from '../../api/searchApi';

const RegistrationSearch = () => {
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[1]);
  const [page, setPage] = useState(0);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  // const queryParam = params.get(RegistrationSearchParamKey.Query) ?? '';
  // const typeParam = params.get(RegistrationSearchParamKey.Type) ?? '';

  // const [searchResults, isLoadingSearch] = useSearchRegistrations(
  //   { searchTerm: queryParam, properties: [{ fieldName: SearchFieldName.Subtype, value: typeParam }] },
  //   rowsPerPage,
  //   page * rowsPerPage
  // );
  const paramsString = params.toString();
  const url = paramsString ? `${SearchApiPaths.REGISTRATIONS}?${params.toString()}` : SearchApiPaths.REGISTRATIONS;
  const [searchResults2, isLoadingSearch2] = useFetch<SearchResult>(url);

  return (
    <>
      {isLoadingSearch2 || !searchResults2 ? (
        <ListSkeleton arrayLength={3} minWidth={40} height={100} />
      ) : (
        <>
          <SearchResults searchResult={searchResults2} />
          {searchResults2.hits.length > 0 && (
            <TablePagination
              data-testid="search-pagination"
              rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
              component="div"
              count={searchResults2.total}
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
