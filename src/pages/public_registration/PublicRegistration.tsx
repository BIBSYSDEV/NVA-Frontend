import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { RootState } from '../../redux/store';
import { Registration, RegistrationStatus } from '../../types/registration.types';
import { userCanEditRegistration } from '../../utils/registration-helpers';
import NotFound from '../errorpages/NotFound';
import { NotPublished } from '../errorpages/NotPublished';
import { PageSpinner } from '../../components/PageSpinner';
import { PublicRegistrationContent } from './PublicRegistrationContent';
import { useFetch } from '../../utils/hooks/useFetch';
import { PublicationsApiPath } from '../../api/apiPaths';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { RegistrationParams } from '../../utils/urlPaths';
import { SyledPageContent } from '../../components/styled/Wrappers';
import { ActionPanel } from './ActionPanel';
import { TicketCollection } from '../../types/publication_types/messages.types';

const PublicRegistration = () => {
  const { t } = useTranslation();
  const { identifier } = useParams<RegistrationParams>();
  const user = useSelector((store: RootState) => store.user);

  const [registration, isLoadingRegistration, refetchRegistration] = useFetch<Registration>({
    url: `${PublicationsApiPath.Registration}/${identifier}`,
    errorMessage: t('feedback.error.get_registration'),
  });

  const isRegistrationAdmin = !!registration && userCanEditRegistration(user, registration);
  const isAllowedToSeePublicRegistration = registration?.status === RegistrationStatus.Published || isRegistrationAdmin;

  const [registrationTicketCollection, isLoadingRegistrationTicketCollection] = useFetch<TicketCollection>({
    url: isRegistrationAdmin ? `${registration.id}/tickets` : '',
    withAuthentication: true,
    errorMessage: t('feedback.error.get_tickets'),
  });

  return (
    <SyledPageContent>
      {isLoadingRegistration ||
      isLoadingRegistrationTicketCollection ||
      (isRegistrationAdmin && !registrationTicketCollection) ? (
        <PageSpinner aria-label={t('common.registration')} />
      ) : registration ? (
        isAllowedToSeePublicRegistration ? (
          <ErrorBoundary>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}>
              {isRegistrationAdmin && (
                <ActionPanel
                  registration={registration}
                  refetchRegistration={refetchRegistration}
                  tickets={registrationTicketCollection?.tickets ?? []}
                />
              )}
              <PublicRegistrationContent
                registration={registration}
                tickets={registrationTicketCollection?.tickets ?? []}
              />
            </Box>
          </ErrorBoundary>
        ) : (
          <NotPublished />
        )
      ) : (
        <NotFound />
      )}
    </SyledPageContent>
  );
};

export default PublicRegistration;
