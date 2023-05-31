import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { UseQueryResult } from '@tanstack/react-query';
import { TicketList } from './components/TicketList';
import { ExpandedTicket } from '../../types/publication_types/ticket.types';
import { SearchResponse } from '../../types/common.types';

interface MyMessagesPageProps {
  ticketsQuery: UseQueryResult<SearchResponse<ExpandedTicket>, unknown>;
  setRowsPerPage: Dispatch<SetStateAction<number>>;
  rowsPerPage: number;
  setPage: Dispatch<SetStateAction<number>>;
  page: number;
}

export const MyMessagesPage = ({ ticketsQuery, rowsPerPage, setRowsPerPage, page, setPage }: MyMessagesPageProps) => {
  const { t } = useTranslation();

  return (
    <TicketList
      ticketsQuery={ticketsQuery}
      rowsPerPage={rowsPerPage}
      setRowsPerPage={setRowsPerPage}
      page={page}
      setPage={setPage}
      helmetTitle={t('my_page.messages.messages')}
    />
  );
};
