import { List, TablePagination, Typography } from '@mui/material';
import { UseQueryResult } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { SearchResponse } from '../../../types/common.types';
import { ExpandedTicket } from '../../../types/publication_types/ticket.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { stringIncludesMathJax, typesetMathJax } from '../../../utils/mathJaxHelpers';
import { TicketListItem } from './TicketListItem';

interface TicketListProps {
  ticketsQuery: UseQueryResult<SearchResponse<ExpandedTicket>, unknown>;
  setRowsPerPage: Dispatch<SetStateAction<number>>;
  rowsPerPage: number;
  setPage: Dispatch<SetStateAction<number>>;
  page: number;
  helmetTitle: string;
}

export const ticketsPerPageOptions = [10, 20, 50];

export const TicketList = ({
  ticketsQuery,
  setRowsPerPage,
  rowsPerPage,
  setPage,
  page,
  helmetTitle,
}: TicketListProps) => {
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
        <title>{helmetTitle}</title>
      </Helmet>

      {ticketsQuery.isLoading ? (
        <ListSkeleton minWidth={100} maxWidth={100} height={100} />
      ) : (
        <>
          {tickets.length === 0 ? (
            <Typography>{t('my_page.messages.no_messages')}</Typography>
          ) : (
            <>
              <List disablePadding>
                {tickets.map((ticket) => (
                  <ErrorBoundary key={ticket.id}>
                    <TicketListItem key={ticket.id} ticket={ticket} />
                  </ErrorBoundary>
                ))}
              </List>
              <TablePagination
                aria-live="polite"
                data-testid={dataTestId.startPage.searchPagination}
                rowsPerPageOptions={ticketsPerPageOptions}
                component="div"
                count={ticketsQuery.data?.size ?? 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => setRowsPerPage(+event.target.value)}
              />
            </>
          )}
        </>
      )}
    </section>
  );
};
