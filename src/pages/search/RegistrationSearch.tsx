import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, TablePagination, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { ListSkeleton } from '../../components/ListSkeleton';
import { ROWS_PER_PAGE_OPTIONS } from '../../utils/constants';
import { SearchResults } from './SearchResults';
import { SearchApiPath } from '../../api/apiPaths';
import { useFetch } from '../../utils/hooks/useFetch';
import { dataTestId } from '../../utils/dataTestIds';
import { SearchResult } from '../../types/registration.types';

const defaultRowsPerPage = ROWS_PER_PAGE_OPTIONS[1];

export const RegistrationSearch = () => {
  const { t } = useTranslation('common');
  const history = useHistory();
  const params = useMemo(() => new URLSearchParams(history.location.search), [history.location.search]);

  const resultsParam = params.get('results');
  const fromParam = params.get('from');

  const initialRowsPerPage = (resultsParam && +resultsParam) || defaultRowsPerPage;
  const initalPage = (fromParam && resultsParam && Math.floor(+fromParam / initialRowsPerPage)) || 0;

  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [page, setPage] = useState(initalPage);

  useEffect(() => {
    params.set('results', rowsPerPage.toString());
    params.set('from', (page * rowsPerPage).toString());
    history.push({ search: params.toString() });
  }, [history, params, rowsPerPage, page]);

  const [searchResults, isLoadingSearch] = useFetch<SearchResult>({
    url: `${SearchApiPath.Registrations}?${params.toString()}`,
    errorMessage: t('feedback:error.search'),
  });

  return (
    <Box gridArea="results">
      {isLoadingSearch ? (
        <ListSkeleton arrayLength={3} minWidth={40} height={100} />
      ) : searchResults && searchResults.hits.length > 0 ? (
        <>
          <SearchResults searchResult={searchResults} />
          <TablePagination
            data-testid={dataTestId.startPage.searchPagination}
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
        <Typography>{t('no_hits')}</Typography>
      )}
    </Box>
  );
};
