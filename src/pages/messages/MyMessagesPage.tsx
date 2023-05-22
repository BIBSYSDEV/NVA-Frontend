import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { UseQueryResult } from '@tanstack/react-query';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import { TicketList } from './components/TicketList';
import { ExpandedTicket } from '../../types/publication_types/ticket.types';
import { SearchResponse } from '../../types/common.types';

interface MyMessagesPageProps {
  ticketsQuery: UseQueryResult<SearchResponse<ExpandedTicket>, unknown>;
}

export const MyMessagesPage = ({ ticketsQuery }: MyMessagesPageProps) => {
  const { t } = useTranslation();

  const tickets = ticketsQuery.data?.hits ?? [];

  return (
    <>
      <Helmet>
        <title>{t('my_page.messages.messages')}</title>
      </Helmet>
      <BackgroundDiv>
        <TicketList tickets={tickets} />
      </BackgroundDiv>
    </>
  );
};
