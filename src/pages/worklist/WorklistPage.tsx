import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/PageHeader';
import { StyledPageWrapperWithMaxWidth } from '../../components/styled/Wrappers';

import { SearchApiPath } from '../../api/apiPaths';
import { useFetch } from '../../utils/hooks/useFetch';
import { SupportRequest } from '../../types/publication_types/messages.types';
import { ListSkeleton } from '../../components/ListSkeleton';
import { MessagesOverview } from './MessagesOverview';

interface Hit {
  _source: SupportRequest;
}
interface MessagesResponse {
  hits: {
    hits: Hit[];
  };
}

const WorklistPage = () => {
  const { t } = useTranslation('workLists');

  const [worklistItems, isLoadingWorklistItems, refetch] = useFetch<MessagesResponse>({
    url: SearchApiPath.Messages,
    errorMessage: t('feedback:error.get_messages'), //todo
    withAuthentication: true,
  });

  const supportRequests = worklistItems?.hits.hits.map((x) => x._source) ?? [];

  return (
    <StyledPageWrapperWithMaxWidth>
      <PageHeader>{t('worklist')}</PageHeader>
      {isLoadingWorklistItems ? (
        <ListSkeleton minWidth={100} maxWidth={100} height={100} />
      ) : (
        <MessagesOverview conversations={supportRequests} refetch={refetch} />
      )}
    </StyledPageWrapperWithMaxWidth>
  );
};

export default WorklistPage;
