import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { CircularProgress, Typography } from '@mui/material';
import { PageHeader } from '../../components/PageHeader';
import { SyledPageContent } from '../../components/styled/Wrappers';
import { RoleApiPath, SearchApiPath } from '../../api/apiPaths';
import { useFetch } from '../../utils/hooks/useFetch';
import { Ticket } from '../../types/publication_types/messages.types';
import { ListSkeleton } from '../../components/ListSkeleton';
import { SearchResponse } from '../../types/common.types';
import { RootState } from '../../redux/store';
import { useFetchResource } from '../../utils/hooks/useFetchResource';
import { Organization } from '../../types/organization.types';
import { getLanguageString } from '../../utils/translation-helpers';
import { TicketAccordionList } from './TicketAccordionList';
import { InstitutionUser } from '../../types/user.types';

const WorklistPage = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);

  const [institutionUser] = useFetch<InstitutionUser>({
    url: user?.username ? `${RoleApiPath.Users}/${user.username}` : '',
    errorMessage: t('feedback.error.get_roles'),
    withAuthentication: true,
  });

  const viewingScopes = institutionUser?.viewingScope?.includedUnits ?? [];
  const viewingScopeId = viewingScopes.length > 0 ? viewingScopes[0] : '';
  const [viewingScopeOrganization, isLoadingViewingScopeOrganization] = useFetchResource<Organization>(viewingScopeId);

  const [ticketsResponse, isLoadingTicketsRequests] = useFetch<SearchResponse<Ticket>>({
    url: SearchApiPath.Tickets,
    errorMessage: t('feedback.error.get_messages'),
    withAuthentication: true,
  });

  const tickets = ticketsResponse?.hits ?? [];

  return (
    <SyledPageContent>
      <PageHeader>{t('worklist.worklist')}</PageHeader>
      {isLoadingTicketsRequests ? (
        <ListSkeleton minWidth={100} maxWidth={100} height={100} />
      ) : (
        <>
          {viewingScopeId ? (
            isLoadingViewingScopeOrganization ? (
              <CircularProgress />
            ) : (
              viewingScopeOrganization && (
                <Typography paragraph sx={{ fontWeight: 'bold' }}>
                  {t('worklist.limited_to', {
                    name: getLanguageString(viewingScopeOrganization.name),
                  })}
                </Typography>
              )
            )
          ) : null}
          <TicketAccordionList tickets={tickets} />
        </>
      )}
    </SyledPageContent>
  );
};

export default WorklistPage;
