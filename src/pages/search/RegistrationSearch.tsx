import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TablePagination, Typography } from '@material-ui/core';
import ListSkeleton from '../../components/ListSkeleton';
import { ROWS_PER_PAGE_OPTIONS } from '../../utils/constants';
import { useSearchRegistrations } from '../../utils/hooks/useSearchRegistrations';
import SearchResults from './SearchResults';
import { SearchConfig } from '../../utils/searchHelpers';

interface RegistrationSearchProps {
  searchConfig?: SearchConfig;
  noHitsText?: string;
}

export const RegistrationSearch = ({ searchConfig, noHitsText }: RegistrationSearchProps) => {
  const { t } = useTranslation('common');
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[1]);
  const [page, setPage] = useState(0);
  const [searchResults, isLoadingSearch] = useSearchRegistrations(searchConfig, rowsPerPage, page * rowsPerPage);

  return (
    <>
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
