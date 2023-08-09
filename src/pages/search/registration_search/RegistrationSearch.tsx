import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ListPagination } from '../../../components/ListPagination';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { RegistrationSearchResponse } from '../../../types/registration.types';
import { ROWS_PER_PAGE_OPTIONS } from '../../../utils/constants';
import { dataTestId } from '../../../utils/dataTestIds';
import { SearchParam } from '../../../utils/searchHelpers';
import { RegistrationSearchResults } from './RegistrationSearchResults';

interface RegistrationSearchProps {
  searchResults?: RegistrationSearchResponse;
  isLoadingSearch: boolean;
}

export const RegistrationSearch = ({ searchResults, isLoadingSearch }: RegistrationSearchProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const params = new URLSearchParams(history.location.search);

  const resultsParam = params.get(SearchParam.Results);
  const fromParam = params.get(SearchParam.From);

  const rowsPerPage = (resultsParam && +resultsParam) || ROWS_PER_PAGE_OPTIONS[0];
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
          <ListPagination
            count={searchResults.size}
            page={page + 1}
            onPageChange={(newPage) => updatePath(((newPage - 1) * rowsPerPage).toString(), rowsPerPage.toString())}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(newRowsPerPage) => updatePath('0', newRowsPerPage.toString())}
            dataTestId={dataTestId.startPage.searchPagination}
          />
        </>
      ) : (
        <Typography>{t('common.no_hits')}</Typography>
      )}
    </section>
  );
};
