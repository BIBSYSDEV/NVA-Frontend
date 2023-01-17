import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { PublicationsApiPath } from '../../api/apiPaths';
import { ListSkeleton } from '../../components/ListSkeleton';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import { TicketCollection } from '../../types/publication_types/messages.types';
import { useFetch } from '../../utils/hooks/useFetch';
import { TicketAccordionList } from './TicketAccordionList';

export const MyMessagesPage = () => {
  const { t } = useTranslation();

  const [ticketsCollection, isLoadingTicketsCollection] = useFetch<TicketCollection>({
    url: PublicationsApiPath.Tickets,
    errorMessage: t('feedback.error.get_messages'),
    withAuthentication: true,
  });

  const tickets = ticketsCollection?.tickets ?? [];

  return (
    <>
      <Helmet>
        <title>{t('my_page.messages.messages')}</title>
      </Helmet>
      <BackgroundDiv>
        {isLoadingTicketsCollection ? (
          <ListSkeleton minWidth={100} maxWidth={100} height={100} />
        ) : (
          <TicketAccordionList tickets={tickets} />
        )}
      </BackgroundDiv>
    </>
  );
};
