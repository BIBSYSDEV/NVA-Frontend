import { List, Typography } from '@mui/material';
import { UseQueryResult } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { ListPagination } from '../../../components/ListPagination';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { SearchForm } from '../../../components/SearchForm';
import { TicketSearchResponse } from '../../../types/publication_types/ticket.types';
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

export const TicketList = ({ ticketsQuery, setRowsPerPage, rowsPerPage, setPage, page, title }: TicketListProps) => {
  const { t } = useTranslation();

  const tickets = useMemo(() => ticketsQuery.data?.hits ?? [], [ticketsQuery.data?.hits]);

  useEffect(() => {
    if (tickets.some(({ publication }) => stringIncludesMathJax(publication.mainTitle))) {
      typesetMathJax();
    }
  }, [tickets]);

  return (
    <section>
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <Typography variant="h2" sx={{ mb: '1rem' }}>
        {title}
      </Typography>

      <SearchForm sx={{ mb: '1.8rem' }} placeholder={t('tasks.search_placeholder')} />

      {ticketsQuery.isLoading ? (
        <ListSkeleton minWidth={100} maxWidth={100} height={100} />
      ) : (
        <>
          {tickets.length === 0 ? (
            <Typography>{t('my_page.messages.no_messages')}</Typography>
          ) : (
            <>
              <List disablePadding sx={{ mb: '0.5rem' }}>
                {tickets.map((ticket) => (
                  <ErrorBoundary key={ticket.id}>
                    <TicketListItem key={ticket.id} ticket={ticket} />
                  </ErrorBoundary>
                ))}
              </List>
              <ListPagination
                count={ticketsQuery.data?.size ?? 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(newPage) => setPage(newPage)}
                onRowsPerPageChange={(newRowsPerPage) => {
                  setRowsPerPage(newRowsPerPage);
                  setPage(1);
                }}
                maxHits={10_000}
              />
            </>
          )}
        </>
      )}
    </section>
  );
};
