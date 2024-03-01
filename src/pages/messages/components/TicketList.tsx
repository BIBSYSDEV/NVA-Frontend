import { Grid, List, Typography } from '@mui/material';
import { UseQueryResult } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { TicketSearchParam } from '../../../api/searchApi';
import { CuratorSelector } from '../../../components/CuratorSelector';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { ListPagination } from '../../../components/ListPagination';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { SearchForm } from '../../../components/SearchForm';
import { SortSelector } from '../../../components/SortSelector';
import { TicketStatusFilter } from '../../../components/TicketStatusFilter';
import { TicketSearchResponse } from '../../../types/publication_types/ticket.types';
import { RoleName } from '../../../types/user.types';
import { stringIncludesMathJax, typesetMathJax } from '../../../utils/mathJaxHelpers';
import { UrlPathTemplate } from '../../../utils/urlPaths';
import { TicketListItem } from './TicketListItem';

interface TicketListProps {
  ticketsQuery: UseQueryResult<TicketSearchResponse>;
  setRowsPerPage: Dispatch<SetStateAction<number>>;
  rowsPerPage: number;
  setPage: Dispatch<SetStateAction<number>>;
  page: number;
  title: string;
}

export const TicketList = ({ ticketsQuery, setRowsPerPage, rowsPerPage, setPage, page, title }: TicketListProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const isOnTasksPage = location.pathname === UrlPathTemplate.TasksDialogue;

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
      aria-label={t('search.sort_by')}
      size="small"
      variant="standard"
      options={[
        { label: t('common.sort_newest_first'), orderBy: 'createdDate', sortOrder: 'desc' },
        { label: t('common.sort_oldest_first'), orderBy: 'createdDate', sortOrder: 'asc' },
      ]}
    />
  );

  return (
    <section>
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <Grid container columns={16} gap={2} sx={{ px: { xs: '0.5rem', md: 0 } }}>
        <Grid item xs={16} md={5} lg={4}>
          <TicketStatusFilter />
        </Grid>
        <Grid item xs={16} md={11} lg={12}>
          <SearchForm placeholder={t('tasks.search_placeholder')} />
        </Grid>
        <Grid item xs={16} md={5} lg={4}>
          {isOnTasksPage && (
            <CuratorSelector roleFilter={[RoleName.SupportCurator, RoleName.PublishingCurator, RoleName.DoiCurator]} />
          )}
        </Grid>
      </Grid>

      {ticketsQuery.isLoading ? (
        <ListSkeleton minWidth={100} maxWidth={100} height={100} />
      ) : (
        <>
          {tickets.length === 0 ? (
            <Typography>{t('my_page.messages.no_messages')}</Typography>
          ) : (
            <ListPagination
              count={ticketsQuery.data?.size ?? 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(newPage) => setPage(newPage)}
              onRowsPerPageChange={(newRowsPerPage) => {
                setRowsPerPage(newRowsPerPage);
                setPage(1);
              }}
              showPaginationTop
              sortingComponent={sortingComponent}
              maxHits={10_000}>
              <List disablePadding sx={{ my: '0.5rem' }}>
                {tickets.map((ticket) => (
                  <ErrorBoundary key={ticket.id}>
                    <TicketListItem key={ticket.id} ticket={ticket} />
                  </ErrorBoundary>
                ))}
              </List>
            </ListPagination>
          )}
        </>
      )}
    </section>
  );
};
