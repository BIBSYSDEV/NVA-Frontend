import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { RootState } from '../../redux/store';
import { RegistrationStatus } from '../../types/registration.types';
import { userIsRegistrationCurator, userIsRegistrationOwner } from '../../utils/registration-helpers';
import NotFound from '../errorpages/NotFound';
import { NotPublished } from '../errorpages/NotPublished';
import { PageSpinner } from '../../components/PageSpinner';
import { PublicRegistrationContent } from './PublicRegistrationContent';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { RegistrationParams } from '../../utils/urlPaths';
import { ActionPanel } from './ActionPanel';
import { fetchRegistration, fetchRegistrationTickets } from '../../api/registrationApi';
import { setNotification } from '../../redux/notificationSlice';

export const RegistrationLandingPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { identifier } = useParams<RegistrationParams>();
  const { user } = useSelector((store: RootState) => store);

  const registrationQuery = useQuery({
    queryKey: ['registration', identifier],
    queryFn: () => fetchRegistration(identifier),
    onError: () => dispatch(setNotification({ message: t('feedback.error.get_registration'), variant: 'error' })),
  });

  const registration = registrationQuery.data;
  const registrationId = registration?.id ?? '';

  const isRegistrationAdmin =
    userIsRegistrationOwner(user, registration) || userIsRegistrationCurator(user, registration);
  const isAllowedToSeePublicRegistration = registration?.status === RegistrationStatus.Published || isRegistrationAdmin;

  const ticketsQuery = useQuery({
    enabled: isRegistrationAdmin,
    queryKey: ['registrationTickets', registrationId],
    queryFn: () => fetchRegistrationTickets(registrationId),
    onError: () => dispatch(setNotification({ message: t('feedback.error.get_tickets'), variant: 'error' })),
  });

  const refetchRegistrationAndTickets = () => {
    ticketsQuery.refetch();
    registrationQuery.refetch();
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
      {registrationQuery.isLoading || (isRegistrationAdmin && ticketsQuery.isLoading) ? (
        <PageSpinner aria-label={t('common.registration')} />
      ) : registration ? (
        isAllowedToSeePublicRegistration ? (
          <ErrorBoundary>
            <PublicRegistrationContent registration={registration} />

            {isRegistrationAdmin && ticketsQuery.isSuccess && (
              <ActionPanel
                registration={registration}
                refetchRegistrationAndTickets={refetchRegistrationAndTickets}
                tickets={ticketsQuery.data?.tickets ?? []}
                isLoadingData={registrationQuery.isFetching || ticketsQuery.isFetching}
              />
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
