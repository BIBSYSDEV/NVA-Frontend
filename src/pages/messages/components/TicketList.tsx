import { Box, Checkbox, List, ListItemText, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { UseQueryResult } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { TicketSearchParam } from '../../../api/searchApi';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { ListPagination } from '../../../components/ListPagination';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { SearchForm } from '../../../components/SearchForm';
import { SortSelector } from '../../../components/SortSelector';
import { TicketSearchResponse, TicketStatus } from '../../../types/publication_types/ticket.types';
import { stringIncludesMathJax, typesetMathJax } from '../../../utils/mathJaxHelpers';
import { TicketListItem } from './TicketListItem';

interface TicketListProps {
  ticketsQuery: UseQueryResult<TicketSearchResponse>;
  setRowsPerPage: Dispatch<SetStateAction<number>>;
  rowsPerPage: number;
  setPage: Dispatch<SetStateAction<number>>;
  page: number;
  title: string;
}

type SelectedStatusState = {
  [key in TicketStatus]: boolean;
};

export const TicketList = ({ ticketsQuery, setRowsPerPage, rowsPerPage, setPage, page, title }: TicketListProps) => {
  const { t } = useTranslation();

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

  const [selectedStatuses, setSelectedStatuses] = useState<SelectedStatusState>({
    New: true,
    Pending: true,
    Completed: true,
    Closed: true,
  });

  const selectedStatusesArray = Object.entries(selectedStatuses)
    .filter(([_, selected]) => selected)
    .map(([key]) => key);

  const handleChange = (event: SelectChangeEvent<typeof selectedStatusesArray>) => {
    setSelectedStatuses(
      Object.fromEntries(
        Object.entries(selectedStatuses).map(([status]) => [status, event.target.value.includes(status)])
      ) as SelectedStatusState
    );
  };

  return (
    <section>
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <Typography variant="h2" sx={{ mb: '1rem' }}>
        {title}
      </Typography>

      <Box sx={{ mb: '1rem', display: 'flex', gap: '0.5rem' }}>
        <Select
          size="small"
          multiple
          value={selectedStatusesArray}
          defaultValue={selectedStatusesArray}
          onChange={handleChange}
          renderValue={(selected) => selected.join(', ')}>
          {Object.entries(selectedStatuses).map(([status, selected]) => (
            <MenuItem key={status} value={status}>
              <Checkbox checked={selected} />
              <ListItemText primary={status} />
            </MenuItem>
          ))}
        </Select>

        <SearchForm sx={{ flex: '1 0 15rem' }} placeholder={t('tasks.search_placeholder')} />
      </Box>

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
