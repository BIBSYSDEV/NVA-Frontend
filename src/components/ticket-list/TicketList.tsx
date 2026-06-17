import { Button, List, Typography } from '@mui/material';
import { UseQueryResult } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { TicketSearchParam } from '../../api/searchApi';
import { CustomerTicketSearchResponse, ticketStatusValues } from '../../types/publication_types/ticket.types';
import { ROWS_PER_PAGE_OPTIONS } from '../../utils/constants';
import { stringIncludesMathJax, typesetMathJax } from '../../utils/mathJaxHelpers';
import { syncParamsWithSearchFields } from '../../utils/searchHelpers';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { ErrorBoundary } from '../ErrorBoundary';
import { ListPagination } from '../ListPagination';
import { ListSkeleton } from '../ListSkeleton';
import { MainContentLayout } from '../page-layouts/MainContentLayout';
import { TicketFilterGrid } from './_components/TicketFilterGrid';
import { TicketListItem } from './_components/TicketListItem';
import { TicketSortSelector } from './_components/TicketSortSelector';
import { SHOW_ALL_VIEWED_BY_VALUE, useTicketsParams } from './_hooks/useTicketsParams';

interface TicketListProps {
  ticketsQuery: UseQueryResult<CustomerTicketSearchResponse>;
  title: string;
  selectedTicketTypes?: string[];
}

export const TicketList = ({ ticketsQuery, title, selectedTicketTypes }: TicketListProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isOnTasksPage = location.pathname === UrlPathTemplate.TasksDialogue;

  const ticketStatusOptions = isOnTasksPage
    ? ticketStatusValues.filter((status) => status !== 'New')
    : ticketStatusValues;
  const tickets = useMemo(() => ticketsQuery.data?.hits ?? [], [ticketsQuery.data?.hits]);

  useEffect(() => {
    if (tickets.some(({ publication }) => stringIncludesMathJax(publication.mainTitle))) {
      typesetMathJax();
    }
  }, [tickets]);

  const { viewedByNot, results, from, searchParams } = useTicketsParams();

  const rowsPerPage = (results && +results) || ROWS_PER_PAGE_OPTIONS[0];
  const page = (from && results && Math.floor(+from / rowsPerPage)) || 0;

  const updatePath = (from: string, results: string) => {
    const syncedParams = syncParamsWithSearchFields(searchParams);
    syncedParams.set(TicketSearchParam.From, from);
    syncedParams.set(TicketSearchParam.Results, results);
    navigate({ search: syncedParams.toString() });
  };

  return (
    <MainContentLayout headTitle={title} heading={title} hiddenHeading sx={{ gap: '0.25rem' }}>
      <TicketFilterGrid showAdvancedFilters={isOnTasksPage} ticketStatusOptions={ticketStatusOptions} />
      <ListPagination
        count={ticketsQuery.data?.totalHits ?? 0}
        page={page + 1}
        onPageChange={(newPage) => updatePath(((newPage - 1) * rowsPerPage).toString(), rowsPerPage.toString())}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(newRowsPerPage) => updatePath('0', newRowsPerPage.toString())}
        showPaginationTop
        sortingComponent={<TicketSortSelector />}
        maxHits={10_000}>
        {ticketsQuery.isPending ? (
          <ListSkeleton minWidth={100} maxWidth={100} height={100} />
        ) : tickets.length === 0 ? (
          viewedByNot === SHOW_ALL_VIEWED_BY_VALUE ? (
            <Typography>{t('my_page.messages.no_dialogues')}</Typography>
          ) : (
            <>
              <Typography gutterBottom>{t('my_page.messages.no_unread_dialogues')}</Typography>
              <Button
                variant="outlined"
                size="small"
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
          <List disablePadding sx={{ my: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {tickets.map((ticket, index) => (
              <ErrorBoundary key={ticket.id}>
                <TicketListItem
                  ticket={ticket}
                  currentOffset={page * rowsPerPage + index}
                  selectedTicketTypes={selectedTicketTypes}
                />
              </ErrorBoundary>
            ))}
          </List>
        )}
      </ListPagination>
    </MainContentLayout>
  );
};
