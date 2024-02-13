import { Box } from '@mui/material';
import { Query, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchRegistration, fetchRegistrationTickets } from '../../api/registrationApi';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { PageSpinner } from '../../components/PageSpinner';
import { setNotification } from '../../redux/notificationSlice';
import { RootState } from '../../redux/store';
import { DeletedRegistrationProblem } from '../../types/error_responses';
import { Registration, RegistrationStatus } from '../../types/registration.types';
import { userIsRegistrationCurator, userIsRegistrationOwner } from '../../utils/registration-helpers';
import { IdentifierParams } from '../../utils/urlPaths';
import NotFound from '../errorpages/NotFound';
import { NotPublished } from '../errorpages/NotPublished';
import { ActionPanel } from './ActionPanel';
import { PublicRegistrationContent } from './PublicRegistrationContent';

export const RegistrationLandingPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { identifier } = useParams<IdentifierParams>();
  const user = useSelector((store: RootState) => store.user);

  const registrationQuery = useQuery({
    queryKey: ['registration', identifier],
    queryFn: () => fetchRegistration(identifier),
    meta: {
      handleError: (
        error: AxiosError<DeletedRegistrationProblem>,
        query: Query<Registration, AxiosError<DeletedRegistrationProblem>>
      ) => {
        if (error.response?.status === 410) {
          const errorRegistration = query.state.error?.response?.data?.resource;
          if (errorRegistration) {
            query.setData(errorRegistration);
          }
        } else {
          dispatch(
            setNotification({
              message: t('feedback.error.get_registration'),
              variant: 'error',
            })
          );
        }
      },
    },
  });

  const registration = registrationQuery.data;

  const isRegistrationAdmin =
    userIsRegistrationOwner(user, registration) || userIsRegistrationCurator(user, registration);
  const isAllowedToSeePublicRegistration =
    registration?.status === RegistrationStatus.Published ||
    isRegistrationAdmin ||
    registration?.status === RegistrationStatus.DraftForDeletion ||
    registration?.status === RegistrationStatus.Unpublished;

  const ticketsQuery = useQuery({
    enabled: isRegistrationAdmin,
    queryKey: ['registrationTickets', identifier],
    queryFn: () => fetchRegistrationTickets(identifier),
    meta: { errorMessage: t('feedback.error.get_tickets') },
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
        <PageSpinner aria-label={t('common.result')} />
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
