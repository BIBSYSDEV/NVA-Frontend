import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { RootState } from '../../redux/store';
import { RegistrationStatus } from '../../types/registration.types';
import { userCanEditRegistration } from '../../utils/registration-helpers';
import NotFound from '../errorpages/NotFound';
import { NotPublished } from '../errorpages/NotPublished';
import { PageSpinner } from '../../components/PageSpinner';
import { PublicRegistrationContent } from './PublicRegistrationContent';
import { PublicationsApiPath } from '../../api/apiPaths';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { RegistrationParams } from '../../utils/urlPaths';
import { StyledPageContent } from '../../components/styled/Wrappers';
import { ActionPanel } from './ActionPanel';
import { fetchRegistration, fetchRegistrationTickets } from '../../api/registrationApi';
import { setNotification } from '../../redux/notificationSlice';

const PublicRegistration = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { identifier } = useParams<RegistrationParams>();
  const { user } = useSelector((store: RootState) => store);

  const registrationQuery = useQuery({
    queryKey: ['registration', identifier],
    queryFn: () => fetchRegistration(`${PublicationsApiPath.Registration}/${identifier}`),
    onError: () => t('feedback.error.get_registration'),
  });

  const registration = registrationQuery.data;

  const isRegistrationAdmin = !!registration && userCanEditRegistration(user, registration);
  const isAllowedToSeePublicRegistration = registration?.status === RegistrationStatus.Published || isRegistrationAdmin;

  const ticketsQuery = useQuery({
    enabled: !!isRegistrationAdmin,
    queryKey: ['registrationTickets', identifier],
    queryFn: () => registration && fetchRegistrationTickets(registration.id),
    onError: () => dispatch(setNotification({ message: t('feedback.error.get_tickets'), variant: 'error' })),
  });

  const refetchRegistrationAndTickets = () => {
    ticketsQuery.refetch();
    registrationQuery.refetch();
  };

  return (
    <StyledPageContent>
      {registrationQuery.isLoading || (isRegistrationAdmin && ticketsQuery.isLoading) ? (
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
              {isRegistrationAdmin && ticketsQuery.isSuccess && (
                <ActionPanel
                  registration={registration}
                  refetchRegistrationAndTickets={refetchRegistrationAndTickets}
                  tickets={ticketsQuery.data?.tickets ?? []}
                />
              )}
              <PublicRegistrationContent registration={registration} />
            </Box>
          </ErrorBoundary>
        ) : (
          <NotPublished />
        )
      ) : (
        <NotFound />
      )}
    </StyledPageContent>
  );
};

export default PublicRegistration;
