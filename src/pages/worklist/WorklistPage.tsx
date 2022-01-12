import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/PageHeader';
import { StyledPageWrapperWithMaxWidth } from '../../components/styled/Wrappers';
import { SearchApiPath } from '../../api/apiPaths';
import { useFetch } from '../../utils/hooks/useFetch';
import { PublicationConversation } from '../../types/publication_types/messages.types';
import { ListSkeleton } from '../../components/ListSkeleton';
import { MessagesOverview } from './MessagesOverview';
import { SearchResponse } from '../../types/common.types';

const WorklistPage = () => {
  const { t } = useTranslation('workLists');

  const [worklistResponse, isLoadingWorklistResponse] = useFetch<SearchResponse<PublicationConversation>>({
    url: SearchApiPath.Messages,
    errorMessage: t('feedback:error.get_messages'),
    withAuthentication: true,
  });

  const supportRequests = worklistResponse?.hits ?? [];

  return (
    <StyledPageWrapperWithMaxWidth>
      <PageHeader>{t('worklist')}</PageHeader>
      {isLoadingWorklistResponse ? (
        <ListSkeleton minWidth={100} maxWidth={100} height={100} />
      ) : (
        <MessagesOverview conversations={supportRequests} />
      )}
    </StyledPageWrapperWithMaxWidth>
  );
};

export default WorklistPage;
