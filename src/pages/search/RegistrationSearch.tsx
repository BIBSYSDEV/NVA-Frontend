import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TablePagination, Typography } from '@material-ui/core';
import ListSkeleton from '../../components/ListSkeleton';
import { ROWS_PER_PAGE_OPTIONS } from '../../utils/constants';
import useSearchRegistrations from '../../utils/hooks/useSearchRegistrations';
import SearchResults from './SearchResults';

interface RegistrationSearchProps {
  searchTerm?: string;
  noHitsText?: string;
}

const RegistrationSearch = ({ searchTerm, noHitsText }: RegistrationSearchProps) => {
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[1]);
  const [page, setPage] = useState(0);
  const [searchResults, isLoadingSearch] = useSearchRegistrations(searchTerm, rowsPerPage, page * rowsPerPage);
  const { t } = useTranslation('common');

  return (
    <>
      {isLoadingSearch ? (
        <ListSkeleton arrayLength={3} minWidth={40} height={100} />
      ) : searchResults && searchResults.hits.length > 0 ? (
        <>
          <SearchResults searchResult={searchResults} searchTerm={searchTerm} />
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
      ) : (
        <Typography>{noHitsText ? noHitsText : t('no_hits')}</Typography>
      )}
    </>
  );
};

export default RegistrationSearch;
