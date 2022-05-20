import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { CircularProgress, Typography } from '@mui/material';
import { PageHeader } from '../../components/PageHeader';
import { SyledPageContent } from '../../components/styled/Wrappers';
import { SearchApiPath } from '../../api/apiPaths';
import { useFetch } from '../../utils/hooks/useFetch';
import { DoiRequestConversation, PublicationConversation } from '../../types/publication_types/messages.types';
import { ListSkeleton } from '../../components/ListSkeleton';
import { SearchResponse } from '../../types/common.types';
import { RootStore } from '../../redux/reducers/rootReducer';
import { useFetchResource } from '../../utils/hooks/useFetchResource';
import { Organization } from '../../types/organization.types';
import { getLanguageString } from '../../utils/translation-helpers';
import { WorklistItems } from './WorklistItems';

const WorklistPage = () => {
  const { t } = useTranslation('workLists');
  const user = useSelector((store: RootStore) => store.user);
  const viewingScopeId = user && user.viewingScope.length > 0 ? user.viewingScope[0] : '';
  const [viewingScopeOrganization, isLoadingViewingScopeOrganization] = useFetchResource<Organization>(viewingScopeId);

  const [worklistResponse, isLoadingWorklistResponse] = useFetch<
    SearchResponse<PublicationConversation | DoiRequestConversation>
  >({
    url: SearchApiPath.Worklist,
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
          {viewingScopeId ? (
            isLoadingViewingScopeOrganization ? (
              <CircularProgress />
            ) : (
              viewingScopeOrganization && (
                <Typography paragraph sx={{ fontWeight: 'bold' }}>
                  {t('limited_to', {
                    name: getLanguageString(viewingScopeOrganization.name),
                  })}
                </Typography>
              )
            )
          ) : null}
          <WorklistItems conversations={supportRequests} />
        </>
      )}
    </SyledPageContent>
  );
};

export default WorklistPage;
