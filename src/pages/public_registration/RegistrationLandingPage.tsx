import { Box } from '@mui/material';
import { Query, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { fetchRegistration, fetchRegistrationTickets } from '../../api/registrationApi';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { PageSpinner } from '../../components/PageSpinner';
import { setNotification } from '../../redux/notificationSlice';
import { DeletedRegistrationProblem } from '../../types/error_responses';
import { Registration, RegistrationStatus } from '../../types/registration.types';
import { userCanEditRegistration } from '../../utils/registration-helpers';
import { IdentifierParams } from '../../utils/urlPaths';
import NotFound from '../errorpages/NotFound';
import { NotPublished } from '../errorpages/NotPublished';
import { ActionPanel } from './ActionPanel';
import { PublicRegistrationContent } from './PublicRegistrationContent';

export const RegistrationLandingPage = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { identifier } = useParams<IdentifierParams>();
  const shouldNotRedirect = new URLSearchParams(history.location.search).has('shouldNotRedirect');

  const registrationQuery = useQuery({
    queryKey: ['registration', identifier, shouldNotRedirect],
    queryFn: () => fetchRegistration(identifier, shouldNotRedirect),
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
  const registrationId = registration?.id ?? '';

  if (identifier !== registration?.identifier && !!registration?.identifier) {
    const newPath = history.location.pathname.replace(identifier, registration.identifier);
    const searchParams = history.location.search ?? '';
    history.replace(newPath + searchParams);
  }

  const canEditRegistration = registration && userCanEditRegistration(registration);

  const isAllowedToSeePublicRegistration =
    registration?.status === RegistrationStatus.Published ||
    canEditRegistration ||
    registration?.status === RegistrationStatus.DraftForDeletion ||
    registration?.status === RegistrationStatus.Unpublished;

  const ticketsQuery = useQuery({
    enabled: canEditRegistration,
    queryKey: ['registrationTickets', registrationId],
    queryFn: () => fetchRegistrationTickets(registrationId),
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
      {registrationQuery.isLoading || (canEditRegistration && ticketsQuery.isLoading) ? (
        <PageSpinner aria-label={t('common.result')} />
      ) : registration ? (
        isAllowedToSeePublicRegistration ? (
          <ErrorBoundary>
            <PublicRegistrationContent registration={registration} />

            {canEditRegistration && ticketsQuery.isSuccess && (
              <ActionPanel
                registration={registration}
                refetchRegistrationAndTickets={refetchRegistrationAndTickets}
                tickets={
                  ticketsQuery.data?.tickets
                    ? ticketsQuery.data.tickets.filter((ticket) => ticket.status !== 'NotApplicable')
                    : []
                }
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
