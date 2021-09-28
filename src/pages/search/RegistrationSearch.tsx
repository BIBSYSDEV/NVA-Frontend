import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TablePagination, Typography } from '@mui/material';
import { ListSkeleton } from '../../components/ListSkeleton';
import { ROWS_PER_PAGE_OPTIONS } from '../../utils/constants';
import { SearchResults } from './SearchResults';
import { useLocation } from 'react-router-dom';
import { SearchApiPath } from '../../api/apiPaths';
import { SearchResult } from '../../types/search.types';
import { useFetch } from '../../utils/hooks/useFetch';
import { dataTestId } from '../../utils/dataTestIds';
import styled from 'styled-components';

const StyledRegistrationSearch = styled.div`
  grid-area: results;
`;

export const RegistrationSearch = (props: unknown) => {
  const { t } = useTranslation('common');
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[1]);
  const [page, setPage] = useState(0);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  params.set('results', rowsPerPage.toString());
  params.set('from', (page * rowsPerPage).toString());
  const paramsString = params.toString();

  const [searchResults, isLoadingSearch] = useFetch<SearchResult>({
    url: `${SearchApiPath.Registrations}?${paramsString}`,
    errorMessage: t('feedback:error.search'),
  });

  return (
    <StyledRegistrationSearch>
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
    </StyledRegistrationSearch>
  );
};
