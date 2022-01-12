import { useTranslation } from 'react-i18next';
import { PublicationsApiPath } from '../../api/apiPaths';
import { ListSkeleton } from '../../components/ListSkeleton';
import { PageHeader } from '../../components/PageHeader';
import { StyledPageWrapperWithMaxWidth } from '../../components/styled/Wrappers';
import { PublicationConversation } from '../../types/publication_types/messages.types';
import { RoleName } from '../../types/user.types';
import { useFetch } from '../../utils/hooks/useFetch';
import { MessagesOverview } from '../worklist/MessagesOverview';

const MyMessagesPage = () => {
  const { t } = useTranslation('workLists');

  const [supportRequestsResponse, isLoadingSupportRequests] = useFetch<PublicationConversation[]>({
    url: `${PublicationsApiPath.Messages}?role=${RoleName.CREATOR}`,
    errorMessage: t('feedback:error.get_messages'),
    withAuthentication: true,
  });
  const supportRequests = supportRequestsResponse ?? [];

  return (
    <StyledPageWrapperWithMaxWidth>
      <PageHeader>{t('messages')}</PageHeader>
      {isLoadingSupportRequests ? (
        <ListSkeleton minWidth={100} maxWidth={100} height={100} />
      ) : (
        <MessagesOverview conversations={supportRequests} />
      )}
    </StyledPageWrapperWithMaxWidth>
  );
};

export default MyMessagesPage;
