import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { ListSkeleton } from '../../components/ListSkeleton';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import { TicketAccordionList } from './TicketAccordionList';
import { fetchTickets } from '../../api/searchApi';

export const MyMessagesPage = () => {
  const { t } = useTranslation();

  const ticketsQuery = useQuery({
    queryKey: ['tickets', 30, 0, false],
    queryFn: () => fetchTickets(30, 0, true),
    onError: () => t('feedback.error.get_messages'),
  });

  const tickets = ticketsQuery.data?.hits ?? [];

  return (
    <>
      <Helmet>
        <title>{t('my_page.messages.messages')}</title>
      </Helmet>
      <BackgroundDiv>
        {ticketsQuery.isLoading ? (
          <ListSkeleton minWidth={100} maxWidth={100} height={100} />
        ) : (
          <TicketAccordionList tickets={tickets} />
        )}
      </BackgroundDiv>
    </>
  );
};
