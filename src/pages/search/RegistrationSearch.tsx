import { useTranslation } from 'react-i18next';
import { Box, TablePagination, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { ListSkeleton } from '../../components/ListSkeleton';
import { ROWS_PER_PAGE_OPTIONS } from '../../utils/constants';
import { SearchResults } from './SearchResults';
import { SearchApiPath } from '../../api/apiPaths';
import { useFetch } from '../../utils/hooks/useFetch';
import { dataTestId } from '../../utils/dataTestIds';
import { SearchParam } from '../../utils/searchHelpers';
import { SearchResponse } from '../../types/common.types';
import { Registration } from '../../types/registration.types';

export const RegistrationSearch = () => {
  const { t } = useTranslation('common');
  const history = useHistory();
  const params = new URLSearchParams(history.location.search);

  const resultsParam = params.get(SearchParam.Results);
  const fromParam = params.get(SearchParam.From);

  const rowsPerPage = (resultsParam && +resultsParam) || ROWS_PER_PAGE_OPTIONS[1];
  const page = (fromParam && resultsParam && Math.floor(+fromParam / rowsPerPage)) || 0;

  const [searchResults, isLoadingSearch] = useFetch<SearchResponse<Registration>>({
    url: `${SearchApiPath.Registrations}?${params.toString()}`,
    errorMessage: t('feedback:error.search'),
  });

  const updatePath = (from: string, results: string) => {
    params.set(SearchParam.From, from);
    params.set(SearchParam.Results, results);
    history.push({ search: params.toString() });
  };

  return (
    <Box gridArea="results">
      {isLoadingSearch && !searchResults ? (
        <ListSkeleton arrayLength={3} minWidth={40} height={100} />
      ) : searchResults && searchResults.hits.length > 0 ? (
        <>
          <SearchResults searchResult={searchResults} />
          <TablePagination
            data-testid={dataTestId.startPage.searchPagination}
            rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
            component="div"
            count={searchResults.size}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => updatePath((newPage * rowsPerPage).toString(), rowsPerPage.toString())}
            onRowsPerPageChange={(event) => updatePath('0', event.target.value)}
          />
        </>
      ) : (
        <Typography>{t('no_hits')}</Typography>
      )}
    </Box>
  );
};
