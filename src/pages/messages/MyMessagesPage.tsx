import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { UseQueryResult } from '@tanstack/react-query';
import { TicketList } from './components/TicketList';
import { ExpandedTicket } from '../../types/publication_types/ticket.types';
import { SearchResponse } from '../../types/common.types';
import { ListSkeleton } from '../../components/ListSkeleton';
import { TablePagination } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import { dataTestId } from '../../utils/dataTestIds';

interface MyMessagesPageProps {
  ticketsQuery: UseQueryResult<SearchResponse<ExpandedTicket>, unknown>;
  setRowsPerPage: Dispatch<SetStateAction<number>>;
  rowsPerPage: number;
  setPage: Dispatch<SetStateAction<number>>;
  page: number;
}

const rowsPerPageOptions = [10, 20, 50];

export const MyMessagesPage = ({ ticketsQuery, rowsPerPage, setRowsPerPage, page, setPage }: MyMessagesPageProps) => {
  const { t } = useTranslation();

  const tickets = ticketsQuery.data?.hits ?? [];

  return (
    <>
      <Helmet>
        <title>{t('my_page.messages.messages')}</title>
      </Helmet>

      <section>
        {ticketsQuery.isLoading ? (
          <ListSkeleton minWidth={100} maxWidth={100} height={100} />
        ) : (
          <>
            <TicketList tickets={tickets} />
            <TablePagination
              aria-live="polite"
              data-testid={dataTestId.startPage.searchPagination}
              rowsPerPageOptions={rowsPerPageOptions}
              component="div"
              count={ticketsQuery.data?.size ?? 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => setRowsPerPage(+event.target.value)}
            />
          </>
        )}
      </section>
    </>
  );
};
