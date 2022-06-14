import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { PublicationsApiPath } from '../../api/apiPaths';
import { ListSkeleton } from '../../components/ListSkeleton';
import { PublicationConversation } from '../../types/publication_types/messages.types';
import { RoleName } from '../../types/user.types';
import { useFetch } from '../../utils/hooks/useFetch';
import { MyMessages } from './MyMessages';

const MyMessagesPage = () => {
  const { t } = useTranslation('workLists');

  const [supportRequestsResponse, isLoadingSupportRequests] = useFetch<PublicationConversation[]>({
    url: `${PublicationsApiPath.Messages}?role=${RoleName.Creator}`,
    errorMessage: t('feedback:error.get_messages'),
    withAuthentication: true,
  });
  const supportRequests = supportRequestsResponse ?? [];

  return (
    <>
      <Helmet>
        <title>{t('messages')}</title>
      </Helmet>
      {isLoadingSupportRequests ? (
        <ListSkeleton minWidth={100} maxWidth={100} height={100} />
      ) : (
        <MyMessages conversations={supportRequests} />
      )}
    </>
  );
};

export default MyMessagesPage;
