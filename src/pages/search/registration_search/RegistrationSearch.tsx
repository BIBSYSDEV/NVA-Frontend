import { Typography } from '@mui/material';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { ListPagination } from '../../../components/ListPagination';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { RegistrationList, RegistrationListProps } from '../../../components/RegistrationList';
import { ROWS_PER_PAGE_OPTIONS } from '../../../utils/constants';
import { SearchParam, syncParamsWithSearchFields } from '../../../utils/searchHelpers';
import { SearchPageProps } from '../SearchPage';
import { RegistrationSortSelector } from './RegistrationSortSelector';

interface RegistrationSearchProps extends Omit<RegistrationListProps, 'registrations'> {
  registrationQuery: SearchPageProps['registrationQuery'];
  sortingComponent?: ReactNode;
}

export const RegistrationSearch = ({ registrationQuery, sortingComponent, ...rest }: RegistrationSearchProps) => {
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

  const registrations = registrationQuery.data?.hits ?? [];

  return (
    <section>
      <ListPagination
        paginationAriaLabel={t('common.pagination_project_search')}
        count={registrationQuery.data?.totalHits ?? 0}
        page={page + 1}
        onPageChange={(newPage) => updatePath(((newPage - 1) * rowsPerPage).toString(), rowsPerPage.toString())}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(newRowsPerPage) => updatePath('0', newRowsPerPage.toString())}
        maxHits={10_000}
        showPaginationTop
        sortingComponent={sortingComponent ?? <RegistrationSortSelector />}>
        {registrationQuery.isFetching ? (
          <ListSkeleton arrayLength={3} minWidth={40} height={100} />
        ) : registrationQuery.data?.hits && registrationQuery.data.hits.length > 0 ? (
          <RegistrationList registrations={registrations} {...rest} />
        ) : (
          <Typography sx={{ mx: { xs: '0.5rem', md: 0 }, mt: '1rem' }}>{t('search.no_results')}</Typography>
        )}
      </ListPagination>
    </section>
  );
};
