import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { PublicationsApiPath } from '../../api/apiPaths';
import { ListSkeleton } from '../../components/ListSkeleton';
import { TicketCollection } from '../../types/publication_types/messages.types';
import { useFetch } from '../../utils/hooks/useFetch';
import { MyMessages } from './MyMessages';

export const MyMessagesPage = () => {
  const { t } = useTranslation();

  const [ticketsResponse, isLoadingTicketsRequests] = useFetch<TicketCollection>({
    url: PublicationsApiPath.Tickets,
    errorMessage: t('feedback.error.get_messages'),
    withAuthentication: true,
  });

  const tickets = ticketsResponse?.tickets ?? [];

  return (
    <>
      <Helmet>
        <title>{t('my_page.messages.messages')}</title>
      </Helmet>
      {isLoadingTicketsRequests ? (
        <ListSkeleton minWidth={100} maxWidth={100} height={100} />
      ) : (
        <MyMessages tickets={tickets} />
      )}
    </>
  );
};
