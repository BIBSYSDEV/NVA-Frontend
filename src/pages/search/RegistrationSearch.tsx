import React, { useState } from 'react';
import { TablePagination } from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import ListSkeleton from '../../components/ListSkeleton';
import { ROWS_PER_PAGE_OPTIONS } from '../../utils/constants';
import useSearchRegistrations from '../../utils/hooks/useSearchRegistrations';
import { SearchFieldName } from '../../types/search.types';
import { RegistrationSearchParamKey } from '../../components/SearchBar';
import { SearchResults } from './SearchResults';

const RegistrationSearch = () => {
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[1]);
  const [page, setPage] = useState(0);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const queryParam = params.get(RegistrationSearchParamKey.Query) ?? '';
  const typeParam = params.get(RegistrationSearchParamKey.Type) ?? '';

  const [searchResults, isLoadingSearch] = useSearchRegistrations(
    { searchTerm: queryParam, properties: [{ fieldName: SearchFieldName.Subtype, value: typeParam }] },
    rowsPerPage,
    page * rowsPerPage
  );

  return (
    <>
      {isLoadingSearch || !searchResults ? (
        <ListSkeleton arrayLength={3} minWidth={40} height={100} />
      ) : (
        <>
          <SearchResults searchResult={searchResults} />
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
        </>
      )}
    </>
  );
};

export default RegistrationSearch;
