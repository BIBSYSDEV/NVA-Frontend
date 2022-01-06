import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/PageHeader';
import { StyledPageWrapperWithMaxWidth } from '../../components/styled/Wrappers';

import { SearchApiPath } from '../../api/apiPaths';
import { useFetch } from '../../utils/hooks/useFetch';

const WorklistPage = () => {
  const { t } = useTranslation('workLists');

  const [supportMessages, isLoadingSupportMessages] = useFetch<any>({
    url: SearchApiPath.Messages,
    errorMessage: t('feedback:error.get_messages'), //todo
    withAuthentication: true,
  });
  const [doiRequests, isLoadingDoiRequests] = useFetch<any>({
    url: SearchApiPath.DoiRequests,
    errorMessage: t('feedback:error.get_messages'), //todo
    withAuthentication: true,
  });

  console.log(supportMessages, doiRequests);

  return (
    <StyledPageWrapperWithMaxWidth>
      <PageHeader>{t('worklist')}</PageHeader>
    </StyledPageWrapperWithMaxWidth>
  );
};

export default WorklistPage;
