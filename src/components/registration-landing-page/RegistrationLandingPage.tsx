import { Box } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { matchPath, useLocation, useNavigate, useParams } from 'react-router';
import { useFetchRegistration } from '../../api/hooks/useFetchRegistration';
import { useFetchRegistrationTickets } from '../../api/hooks/useFetchRegistrationTickets';
import { useIsAuthenticated } from '../../api/hooks/useIsAuthenticated';
import { ActionPanelContext } from '../../context/ActionPanelContext';
import { LandingPageContext } from '../../context/LandingPageContext';
import NotFound from '../../pages/errorpages/NotFound';
import { NotPublished } from '../../pages/errorpages/NotPublished';
import { ActionPanel } from '../../pages/public_registration/ActionPanel';
import { PublicRegistrationContent } from '../../pages/public_registration/PublicRegistrationContent';
import { TaskNavigation } from '../../pages/tasks/_components/TaskNavigation';
import { RootState } from '../../redux/store';
import { RegistrationStatus } from '../../types/registration.types';
import { userHasAccessRight } from '../../utils/registration-helpers';
import { doNotRedirectQueryParam, IdentifierParams, UrlPathTemplate } from '../../utils/urlPaths';
import { hasTicketCuratorRole } from '../../utils/user-helpers';
import { ErrorBoundary } from '../ErrorBoundary';
import { PageSpinner } from '../PageSpinner';

export const RegistrationLandingPage = () => {
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { identifier } = useParams<IdentifierParams>();
  const isOnTasksDialogue = !!matchPath(UrlPathTemplate.TasksDialogueRegistration, location.pathname);
  const doNotRedirect = new URLSearchParams(location.search).has(doNotRedirectQueryParam);
  const registrationQuery = useFetchRegistration(identifier, { doNotRedirect });
  const [isAwaitingStatusSync, setIsAwaitingStatusSync] = useState(false);

  const registration = registrationQuery.data;
  const registrationId = registration?.id;

  if (identifier && !!registration?.identifier && identifier !== registration.identifier) {
    // Update URL with the correct identifier if the original result yields an redirect due to being unpublished
    const newPath = location.pathname.replace(identifier, registration.identifier);
    navigate(newPath + location.search, { replace: true, state: location.state });
  }

  const canEditRegistration = userHasAccessRight(registration, 'partial-update');
  // Gate the curator branch on a live token, not just the (possibly stale) Redux user, so that an
  // expired token doesn't trigger a failing authenticated tickets request on this public page.
  const isAuthenticatedQuery = useIsAuthenticated();
  const isTicketCurator = hasTicketCuratorRole(user) && isAuthenticatedQuery.data === true;

  const isAllowedToSeePublicRegistration =
    registration?.status === RegistrationStatus.Published ||
    canEditRegistration ||
    registration?.status === RegistrationStatus.DraftForDeletion ||
    registration?.status === RegistrationStatus.Unpublished;

  const ticketsQuery = useFetchRegistrationTickets(registrationId, {
    enabled: canEditRegistration || isTicketCurator,
  });

  const refetchRegistrationAndTickets = async () => {
    await Promise.all([ticketsQuery.refetch(), registrationQuery.refetch()]);
  };

  return (
    <Box
      component="section"
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '4fr 1fr' },
        gridTemplateAreas: { xs: '"tasks" "registration"', md: '"registration tasks"' },
        gap: '1rem',
      }}>
      {registrationQuery.isPending || (canEditRegistration && ticketsQuery.isPending) ? (
        <PageSpinner aria-label={t('common.result')} />
      ) : registration ? (
        isAllowedToSeePublicRegistration ? (
          <ErrorBoundary>
            <LandingPageContext.Provider value={{ isAwaitingStatusSync, setIsAwaitingStatusSync }}>
              <Box sx={{ position: 'relative' }}>
                <PublicRegistrationContent registration={registration} />
                {isOnTasksDialogue && <TaskNavigation />}
              </Box>
              <ActionPanelContext.Provider value={{ refetchData: refetchRegistrationAndTickets }}>
                <ActionPanel
                  registration={registration}
                  tickets={ticketsQuery.data?.tickets ?? []}
                  isLoadingData={registrationQuery.isFetching || ticketsQuery.isFetching}
                />
              </ActionPanelContext.Provider>
            </LandingPageContext.Provider>
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

export default RegistrationLandingPage;
