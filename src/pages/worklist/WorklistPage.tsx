import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/PageHeader';
import { SyledPageContent } from '../../components/styled/Wrappers';
import { SearchApiPath } from '../../api/apiPaths';
import { useFetch } from '../../utils/hooks/useFetch';
import { PublicationConversation } from '../../types/publication_types/messages.types';
import { ListSkeleton } from '../../components/ListSkeleton';
import { MessagesOverview } from './MessagesOverview';
import { SearchResponse } from '../../types/common.types';
import { useSelector } from 'react-redux';
import { RootStore } from '../../redux/reducers/rootReducer';
import { useFetchResource } from '../../utils/hooks/useFetchResource';
import { Organization } from '../../types/institution.types';
import { getLanguageString } from '../../utils/translation-helpers';
import { CircularProgress, Typography } from '@mui/material';

const WorklistPage = () => {
  const { t } = useTranslation('workLists');
  const user = useSelector((store: RootStore) => store.user);
  const scopeUnitId = user && user.viewingScope.length > 0 ? user.viewingScope[0] : '';
  const [scopeUnit, isLoadingScopeUnit] = useFetchResource<Organization>(scopeUnitId);

  const [worklistResponse, isLoadingWorklistResponse] = useFetch<SearchResponse<PublicationConversation>>({
    url: SearchApiPath.Messages,
    errorMessage: t('feedback:error.get_messages'),
    withAuthentication: true,
  });

  const supportRequests = worklistResponse?.hits ?? [];

  return (
    <SyledPageContent>
      <PageHeader>{t('worklist')}</PageHeader>
      {isLoadingWorklistResponse ? (
        <ListSkeleton minWidth={100} maxWidth={100} height={100} />
      ) : (
        <>
          {isLoadingScopeUnit ? (
            <CircularProgress />
          ) : (
            <Typography paragraph sx={{ fontWeight: 'bold' }}>
              {t('limited_to', { name: scopeUnit ? getLanguageString(scopeUnit.name) : '' })}
            </Typography>
          )}
          <MessagesOverview conversations={supportRequests} />
        </>
      )}
    </SyledPageContent>
  );
};

export default WorklistPage;
