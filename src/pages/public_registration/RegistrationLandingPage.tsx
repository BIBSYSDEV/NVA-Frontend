import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useFetchRegistration } from '../../api/hooks/useFetchRegistration';
import { useFetchRegistrationTickets } from '../../api/hooks/useFetchRegistrationTickets';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { PageSpinner } from '../../components/PageSpinner';
import { RegistrationStatus } from '../../types/registration.types';
import { userHasAccessRight } from '../../utils/registration-helpers';
import { IdentifierParams } from '../../utils/urlPaths';
import NotFound from '../errorpages/NotFound';
import { NotPublished } from '../errorpages/NotPublished';
import { ActionPanel } from './ActionPanel';
import { PublicRegistrationContent } from './PublicRegistrationContent';

export const RegistrationLandingPage = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const { identifier } = useParams<IdentifierParams>();
  const shouldNotRedirect = new URLSearchParams(history.location.search).has('shouldNotRedirect');
  const registrationQuery = useFetchRegistration(identifier, { shouldNotRedirect });

  const registration = registrationQuery.data;
  const registrationId = registration?.id;

  if (identifier !== registration?.identifier && !!registration?.identifier) {
    const newPath = history.location.pathname.replace(identifier, registration.identifier);
    const searchParams = history.location.search ?? '';
    history.replace(newPath + searchParams);
  }

  const canEditRegistration = userHasAccessRight(registration, 'update');

  const isAllowedToSeePublicRegistration =
    registration?.status === RegistrationStatus.Published ||
    canEditRegistration ||
    registration?.status === RegistrationStatus.DraftForDeletion ||
    registration?.status === RegistrationStatus.Unpublished;

  const ticketsQuery = useFetchRegistrationTickets(registrationId, { enabled: canEditRegistration });

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
