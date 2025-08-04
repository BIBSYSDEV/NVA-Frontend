import { Button, FormControl, Grid, InputLabel, List, MenuItem, Select, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { UseQueryResult } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { SortOrder, TicketOrderBy, TicketSearchParam } from '../../../api/searchApi';
import { AreaOfResponsibilitySelector } from '../../../components/AreaOfResponsibiltySelector';
import { CategorySearchFilter } from '../../../components/CategorySearchFilter';
import { CuratorSelector } from '../../../components/CuratorSelector';
import { DialoguesWithoutCuratorButton } from '../../../components/DialoguesWithoutCuratorButton';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { HeadTitle } from '../../../components/HeadTitle';
import { ListPagination } from '../../../components/ListPagination';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { SearchForm } from '../../../components/SearchForm';
import { SortSelector } from '../../../components/SortSelector';
import { TicketStatusFilter } from '../../../components/TicketStatusFilter';
import { RootState } from '../../../redux/store';
import { CustomerTicketSearchResponse, ticketStatusValues } from '../../../types/publication_types/ticket.types';
import { RoleName } from '../../../types/user.types';
import { ROWS_PER_PAGE_OPTIONS } from '../../../utils/constants';
import { dataTestId } from '../../../utils/dataTestIds';
import { stringIncludesMathJax, typesetMathJax } from '../../../utils/mathJaxHelpers';
import { syncParamsWithSearchFields } from '../../../utils/searchHelpers';
import { UrlPathTemplate } from '../../../utils/urlPaths';
import { ExcludeSubunitsCheckbox } from './ExcludeSubunitsCheckbox';
import { TicketDateIntervalFilter } from './TicketDateIntervalFilter';
import { TicketListItem } from './TicketListItem';

interface TicketListProps {
  ticketsQuery: UseQueryResult<CustomerTicketSearchResponse>;
  title: string;
}

const viewedByLabelId = 'viewed-by-select';
const showAllViewedByValue = 'show-all';

export const TicketList = ({ ticketsQuery, title }: TicketListProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isOnTasksPage = location.pathname === UrlPathTemplate.TasksDialogue;
  const user = useSelector((store: RootState) => store.user);

  const ticketStatusOptions = isOnTasksPage
    ? ticketStatusValues.filter((status) => status !== 'New')
    : ticketStatusValues;

  const tickets = useMemo(() => ticketsQuery.data?.hits ?? [], [ticketsQuery.data?.hits]);

  useEffect(() => {
    if (tickets.some(({ publication }) => stringIncludesMathJax(publication.mainTitle))) {
      typesetMathJax();
    }
  }, [tickets]);

  const sortingComponent = (
    <SortSelector
      orderKey={TicketSearchParam.OrderBy}
      sortKey={TicketSearchParam.SortOrder}
      paginationKey={TicketSearchParam.From}
      aria-label={t('search.sort_by')}
      size="small"
      variant="standard"
      options={[
        {
          i18nKey: 'search.sort_by_modified_date',
          orderBy: 'modifiedDate' satisfies TicketOrderBy,
          sortOrder: 'desc' satisfies SortOrder,
        },
        {
          i18nKey: 'common.sort_newest_first',
          orderBy: 'createdDate' satisfies TicketOrderBy,
          sortOrder: 'desc' satisfies SortOrder,
        },
        {
          i18nKey: 'common.sort_oldest_first',
          orderBy: 'createdDate' satisfies TicketOrderBy,
          sortOrder: 'asc' satisfies SortOrder,
        },
      ]}
    />
  );

  const searchParams = new URLSearchParams(location.search);
  const viewedByNotParam = searchParams.get(TicketSearchParam.ViewedByNot) || showAllViewedByValue;
  const resultsParam = searchParams.get(TicketSearchParam.Results);
  const fromParam = searchParams.get(TicketSearchParam.From);
  const rowsPerPage = (resultsParam && +resultsParam) || ROWS_PER_PAGE_OPTIONS[0];
  const page = (fromParam && resultsParam && Math.floor(+fromParam / rowsPerPage)) || 0;

  const updatePath = (from: string, results: string) => {
    const syncedParams = syncParamsWithSearchFields(searchParams);
    syncedParams.set(TicketSearchParam.From, from);
    syncedParams.set(TicketSearchParam.Results, results);
    navigate({ search: syncedParams.toString() });
  };

  return (
    <section>
      <HeadTitle>{title}</HeadTitle>
      <Typography component="h1" sx={visuallyHidden}>
        {title}
      </Typography>
      <Grid container columns={16} spacing={2} sx={{ px: { xs: '0.5rem', md: 0 }, mb: '1rem' }}>
        <Grid size={{ xs: 16, md: 5, lg: 4 }}>
          <TicketStatusFilter options={ticketStatusOptions} />
        </Grid>
        <Grid size={{ xs: 16, md: 11, lg: 9 }}>
          <SearchForm placeholder={t('tasks.search_placeholder')} paginationOffsetParamName={TicketSearchParam.From} />
        </Grid>

        {user && (
          <Grid size={{ xs: 16, md: 5, lg: 3 }}>
            <FormControl fullWidth>
              <InputLabel id={viewedByLabelId}>{t('tasks.display_options')}</InputLabel>
              <Select
                data-testid={dataTestId.tasksPage.unreadSearchSelect}
                size="small"
                value={viewedByNotParam}
                labelId={viewedByLabelId}
                label={t('tasks.display_options')}
                onChange={(event) => {
                  const value = event.target.value;
                  const syncedParams = syncParamsWithSearchFields(searchParams);
                  if (value === showAllViewedByValue) {
                    syncedParams.delete(TicketSearchParam.ViewedByNot);
                  } else {
                    syncedParams.set(TicketSearchParam.ViewedByNot, value);
                  }
                  syncedParams.delete(TicketSearchParam.From);
                  navigate({ search: syncedParams.toString() });
                }}>
                <MenuItem value={showAllViewedByValue}>{t('common.show_all')}</MenuItem>
                <MenuItem value={user.nvaUsername}>{t('tasks.unread_only')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}

        {isOnTasksPage && (
          <>
            <Grid size={{ xs: 16, sm: 8, md: 6, lg: 4 }}>
              <DialoguesWithoutCuratorButton />
            </Grid>
            <Grid size={{ xs: 16, sm: 8, md: 5, lg: 4 }}>
              <CuratorSelector
                selectedUsername={searchParams.get(TicketSearchParam.Assignee)}
                onChange={(curator) => {
                  const syncedParams = syncParamsWithSearchFields(searchParams);
                  if (curator) {
                    syncedParams.set(TicketSearchParam.Assignee, curator.username);
                  } else {
                    syncedParams.delete(TicketSearchParam.Assignee);
                  }

                  syncedParams.delete(TicketSearchParam.From);
                  navigate({ search: syncedParams.toString() });
                }}
                roleFilter={[RoleName.SupportCurator, RoleName.PublishingCurator, RoleName.DoiCurator]}
              />
            </Grid>
            <Grid size={{ xs: 8, lg: 5 }}>
              <AreaOfResponsibilitySelector
                paramName={TicketSearchParam.OrganizationId}
                resetPagination={(params) => {
                  params.delete(TicketSearchParam.From);
                }}
              />
            </Grid>
            <Grid size={{ xs: 8, lg: 3 }}>
              <ExcludeSubunitsCheckbox
                paramName={TicketSearchParam.ExcludeSubUnits}
                paginationParamName={TicketSearchParam.From}
                disabled={!searchParams.has(TicketSearchParam.OrganizationId)}
              />
            </Grid>
          </>
        )}

        <Grid>
          <TicketDateIntervalFilter />
        </Grid>

        <Grid>
          <CategorySearchFilter searchParam={TicketSearchParam.PublicationType} hideHeading />
        </Grid>
      </Grid>
      <ListPagination
        count={ticketsQuery.data?.totalHits ?? 0}
        page={page + 1}
        onPageChange={(newPage) => updatePath(((newPage - 1) * rowsPerPage).toString(), rowsPerPage.toString())}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(newRowsPerPage) => updatePath('0', newRowsPerPage.toString())}
        showPaginationTop
        sortingComponent={sortingComponent}
        maxHits={10_000}>
        {ticketsQuery.isPending ? (
          <ListSkeleton minWidth={100} maxWidth={100} height={100} />
        ) : tickets.length === 0 ? (
          viewedByNotParam === showAllViewedByValue ? (
            <Typography>{t('my_page.messages.no_dialogues')}</Typography>
          ) : (
            <>
              <Typography gutterBottom>{t('my_page.messages.no_unread_dialogues')}</Typography>
              <Button
                variant="outlined"
                size="small"
                sx={{ textTransform: 'none' }}
                onClick={() => {
                  const syncedParams = syncParamsWithSearchFields(searchParams);
                  syncedParams.delete(TicketSearchParam.ViewedByNot);
                  syncedParams.delete(TicketSearchParam.From);
                  navigate({ search: syncedParams.toString() });
                }}>
                {t('my_page.messages.show_read_dialogues')}
              </Button>
            </>
          )
        ) : (
          <List disablePadding sx={{ my: '0.5rem' }}>
            {tickets.map((ticket) => (
              <ErrorBoundary key={ticket.id}>
                <TicketListItem ticket={ticket} />
              </ErrorBoundary>
            ))}
          </List>
        )}
      </ListPagination>
    </section>
  );
};
