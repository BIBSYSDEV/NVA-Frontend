import { useTranslation } from 'react-i18next';
import { TablePagination, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { RegistrationSearchResults } from './RegistrationSearchResults';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { ROWS_PER_PAGE_OPTIONS } from '../../../utils/constants';
import { dataTestId } from '../../../utils/dataTestIds';
import { SearchParam } from '../../../utils/searchHelpers';
import { SearchResponse } from '../../../types/common.types';
import { Registration } from '../../../types/registration.types';

interface RegistrationSearchProps {
  searchResults?: SearchResponse<Registration>;
  isLoadingSearch: boolean;
}

export const RegistrationSearch = ({ searchResults, isLoadingSearch }: RegistrationSearchProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const params = new URLSearchParams(history.location.search);

  const resultsParam = params.get(SearchParam.Results);
  const fromParam = params.get(SearchParam.From);

  const rowsPerPage = (resultsParam && +resultsParam) || ROWS_PER_PAGE_OPTIONS[1];
  const page = (fromParam && resultsParam && Math.floor(+fromParam / rowsPerPage)) || 0;

  const updatePath = (from: string, results: string) => {
    params.set(SearchParam.From, from);
    params.set(SearchParam.Results, results);
    history.push({ search: params.toString() });
  };

  return (
    <section>
      {isLoadingSearch && !searchResults ? (
        <ListSkeleton arrayLength={3} minWidth={40} height={100} />
      ) : searchResults && searchResults.hits.length > 0 ? (
        <>
          <RegistrationSearchResults searchResult={searchResults} />
          <TablePagination
            aria-live="polite"
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
        <Typography>{t('common.no_hits')}</Typography>
      )}
    </section>
  );
};
