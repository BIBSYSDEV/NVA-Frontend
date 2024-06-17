import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ResultSearchOrder } from '../../../api/searchApi';
import { ListPagination } from '../../../components/ListPagination';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { SortSelector } from '../../../components/SortSelector';
import { ROWS_PER_PAGE_OPTIONS } from '../../../utils/constants';
import { SearchParam } from '../../../utils/searchHelpers';
import { SearchPageProps } from '../SearchPage';
import { RegistrationSearchResults } from './RegistrationSearchResults';

export const RegistrationSearch = ({ registrationQuery }: Pick<SearchPageProps, 'registrationQuery'>) => {
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

  const sortingComponent = (
    <SortSelector
      sortKey="sort"
      orderKey="order"
      aria-label={t('search.sort_by')}
      size="small"
      variant="standard"
      options={[
        {
          orderBy: ResultSearchOrder.ModifiedDate,
          sortOrder: 'desc',
          label: t('search.sort_by_modified_date'),
        },
        {
          orderBy: ResultSearchOrder.PublicationDate,
          sortOrder: 'desc',
          label: t('search.sort_by_published_date_desc'),
        },
        {
          orderBy: ResultSearchOrder.PublicationDate,
          sortOrder: 'asc',
          label: t('search.sort_by_published_date_asc'),
        },
        {
          orderBy: ResultSearchOrder.Title,
          sortOrder: 'asc',
          label: t('search.sort_alphabetically_desc'),
        },
        {
          orderBy: ResultSearchOrder.Title,
          sortOrder: 'desc',
          label: t('search.sort_alphabetically_asc'),
        },
        { orderBy: ResultSearchOrder.Relevance, sortOrder: 'desc', label: t('search.sort_by_relevance') },
      ]}
    />
  );

  return (
    <section>
      {registrationQuery.isPending ? (
        <ListSkeleton arrayLength={3} minWidth={40} height={100} />
      ) : registrationQuery.data?.hits && registrationQuery.data.hits.length > 0 ? (
        <>
          <ListPagination
            count={registrationQuery.data.totalHits}
            page={page + 1}
            onPageChange={(newPage) => updatePath(((newPage - 1) * rowsPerPage).toString(), rowsPerPage.toString())}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(newRowsPerPage) => updatePath('0', newRowsPerPage.toString())}
            maxHits={10_000}
            showPaginationTop
            sortingComponent={sortingComponent}>
            <RegistrationSearchResults searchResult={registrationQuery.data.hits} />
          </ListPagination>
        </>
      ) : (
        <Typography sx={{ mx: { xs: '0.5rem', md: 0 } }}>{t('common.no_hits')}</Typography>
      )}
    </section>
  );
};
