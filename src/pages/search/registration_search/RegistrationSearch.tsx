import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { ListPagination } from '../../../components/ListPagination';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { ROWS_PER_PAGE_OPTIONS } from '../../../utils/constants';
import { SearchParam, syncParamsWithSearchFields } from '../../../utils/searchHelpers';
import { SearchPageProps } from '../SearchPage';
import { RegistrationSearchResults } from './RegistrationSearchResults';
import { RegistrationSortSelector } from './RegistrationSortSelector';

export const RegistrationSearch = ({ registrationQuery }: Pick<SearchPageProps, 'registrationQuery'>) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const resultsParam = params.get(SearchParam.Results);
  const fromParam = params.get(SearchParam.From);

  const rowsPerPage = (resultsParam && +resultsParam) || ROWS_PER_PAGE_OPTIONS[0];
  const page = (fromParam && resultsParam && Math.floor(+fromParam / rowsPerPage)) || 0;

  const updatePath = (from: string, results: string) => {
    const syncedParams = syncParamsWithSearchFields(params);
    syncedParams.set(SearchParam.From, from);
    syncedParams.set(SearchParam.Results, results);
    navigate({ search: syncedParams.toString() });
  };

  return (
    <section>
      {registrationQuery.isFetching ? (
        <ListSkeleton arrayLength={3} minWidth={40} height={100} />
      ) : registrationQuery.data?.hits && registrationQuery.data.hits.length > 0 ? (
        <ListPagination
          paginationAriaLabel={t('common.pagination_project_search')}
          count={registrationQuery.data.totalHits}
          page={page + 1}
          onPageChange={(newPage) => updatePath(((newPage - 1) * rowsPerPage).toString(), rowsPerPage.toString())}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(newRowsPerPage) => updatePath('0', newRowsPerPage.toString())}
          maxHits={10_000}
          showPaginationTop
          sortingComponent={<RegistrationSortSelector />}>
          <RegistrationSearchResults searchResult={registrationQuery.data.hits} />
        </ListPagination>
      ) : (
        <Typography sx={{ mx: { xs: '0.5rem', md: 0 } }}>{t('common.no_hits')}</Typography>
      )}
    </section>
  );
};
