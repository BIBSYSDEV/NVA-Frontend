import { Box, List, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { SortSelector } from '../../../components/SortSelector';
import { ROWS_PER_PAGE_OPTIONS } from '../../../utils/constants';
import { SearchParam } from '../../../utils/searchHelpers';
import { CristinSearchPagination } from '../CristinSearchPagination';
import { SearchPageProps } from '../SearchPage';
import { PersonListItem } from './PersonListItem';

type PersonSearchProps = Pick<SearchPageProps, 'personQuery'>;

export const PersonSearch = ({ personQuery }: PersonSearchProps) => {
  const { t } = useTranslation();

  const searchResults = personQuery.data?.hits ?? [];
  const totalHits = personQuery.data?.size ?? 0;

  const history = useHistory();
  const params = new URLSearchParams(history.location.search);
  const resultsParam = params.get(SearchParam.Results);
  const pageParam = params.get(SearchParam.Page);
  const page = pageParam ? +pageParam : 1;

  const rowsPerPage = resultsParam ? +resultsParam : ROWS_PER_PAGE_OPTIONS[0];

  const sortingComponent = (
    <SortSelector
      orderKey="orderBy"
      sortKey="sort"
      paginationKey="page"
      aria-label={t('search.sort_by')}
      size="small"
      variant="standard"
      options={[
        {
          orderBy: 'name',
          sortOrder: 'asc',
          label: t('search.sort_by_last_name_asc'),
        },
        {
          orderBy: 'name',
          sortOrder: 'desc',
          label: t('search.sort_by_last_name_desc'),
        },
      ]}
    />
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {personQuery.isFetching ? (
        <ListSkeleton arrayLength={3} minWidth={40} height={100} />
      ) : searchResults && searchResults.length > 0 ? (
        <div>
          <CristinSearchPagination
            totalCount={totalHits}
            page={page}
            rowsPerPage={rowsPerPage}
            sortingComponent={sortingComponent}>
            <List>
              {searchResults.map((person) => (
                <PersonListItem key={person.id} person={person} />
              ))}
            </List>
          </CristinSearchPagination>
        </div>
      ) : (
        <Typography sx={{ mx: { xs: '0.5rem', md: 0 } }}>{t('common.no_hits')}</Typography>
      )}
    </Box>
  );
};
