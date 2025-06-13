import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useFetchRegistration } from '../../api/hooks/useFetchRegistration';
import { useFetchRegistrationTickets } from '../../api/hooks/useFetchRegistrationTickets';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { PageSpinner } from '../../components/PageSpinner';
import { ActionPanelContext } from '../../context/ActionPanelContext';
import { RootState } from '../../redux/store';
import { RegistrationStatus } from '../../types/registration.types';
import { userHasAccessRight } from '../../utils/registration-helpers';
import { doNotRedirectQueryParam, IdentifierParams } from '../../utils/urlPaths';
import { hasTicketCuratorRole } from '../../utils/user-helpers';
import NotFound from '../errorpages/NotFound';
import { NotPublished } from '../errorpages/NotPublished';
import { ActionPanel } from './ActionPanel';
import { PublicRegistrationContent } from './PublicRegistrationContent';

export const RegistrationLandingPage = () => {
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { identifier } = useParams<IdentifierParams>();
  const doNotRedirect = new URLSearchParams(location.search).has(doNotRedirectQueryParam);
  const registrationQuery = useFetchRegistration(identifier, { doNotRedirect });

  const registration = registrationQuery.data;
  const registrationId = registration?.id;

  if (identifier && !!registration?.identifier && identifier !== registration.identifier) {
    // Update URL with the correct identifier if the original result yields an redirect due to being unpublished
    const newPath = location.pathname.replace(identifier, registration.identifier);
    navigate(newPath + location.search, { replace: true, state: location.state });
  }

  const canEditRegistration = userHasAccessRight(registration, 'partial-update');
  const isTicketCurator = hasTicketCuratorRole(user);

  const isAllowedToSeePublicRegistration =
    registration?.status === RegistrationStatus.Published ||
    canEditRegistration ||
    registration?.status === RegistrationStatus.DraftForDeletion ||
    registration?.status === RegistrationStatus.Unpublished;

  const ticketsQuery = useFetchRegistrationTickets(registrationId, { enabled: canEditRegistration || isTicketCurator });

  const refetchRegistrationAndTickets = async () => {
    await Promise.all([ticketsQuery.refetch(), registrationQuery.refetch()]);
  };

  return (
    <Box
      component="section"
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '4fr 1fr' },
        gridTemplateAreas: { xs: '"tasks" "registration"', sm: '"registration tasks"' },
        gap: '1rem',
      }}>
      {registrationQuery.isPending || (canEditRegistration && ticketsQuery.isPending) ? (
        <PageSpinner aria-label={t('common.result')} />
      ) : registration ? (
        isAllowedToSeePublicRegistration ? (
          <ErrorBoundary>
            <PublicRegistrationContent registration={registration} />

            {canEditRegistration && ticketsQuery.isSuccess && (
              <ActionPanelContext.Provider value={{ refetchData: refetchRegistrationAndTickets }}>
                <ActionPanel
                  registration={registration}
                  refetchRegistrationAndTickets={refetchRegistrationAndTickets}
                  tickets={ticketsQuery.data?.tickets ?? []}
                  isLoadingData={registrationQuery.isFetching || ticketsQuery.isFetching}
                />
              </ActionPanelContext.Provider>
            )}
          </ErrorBoundary>
        ) : (
          <NotPublished />
        )
      ) : (
        <NotFound />
      )}
    </Box>
  );
};
