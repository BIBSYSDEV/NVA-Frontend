import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../redux/store';
import { Registration, RegistrationStatus } from '../../types/registration.types';
import { userIsRegistrationCurator, userIsRegistrationOwner } from '../../utils/registration-helpers';
import NotFound from '../errorpages/NotFound';
import { NotPublished } from '../errorpages/NotPublished';
import { PageSpinner } from '../../components/PageSpinner';
import { PublicRegistrationContent } from './PublicRegistrationContent';
import { useFetch } from '../../utils/hooks/useFetch';
import { PublicationsApiPath } from '../../api/apiPaths';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { RegistrationParams } from '../../utils/urlPaths';
import { Box } from '@mui/material';
import { PublicRegistrationStatusBar } from './PublicRegistrationStatusBar';

const PublicRegistration = () => {
  const { t } = useTranslation();
  const { identifier } = useParams<RegistrationParams>();
  const [registration, isLoadingRegistration, refetchRegistration] = useFetch<Registration>({
    url: `${PublicationsApiPath.Registration}/${identifier}`,
    errorMessage: t('feedback.error.get_registration'),
  });
  const user = useSelector((store: RootState) => store.user);

  const isAllowedToSeePublicRegistration =
    registration?.status === RegistrationStatus.Published ||
    userIsRegistrationOwner(user, registration) ||
    userIsRegistrationCurator(user, registration);

  return (
    <>
      {isLoadingRegistration ? (
        <PageSpinner aria-label={t('common.registration')} />
      ) : registration ? (
        isAllowedToSeePublicRegistration ? (
          <ErrorBoundary>
            <Box
              sx={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: '1fr 4fr 1fr',
                gridTemplateAreas: "'left center right'",
                gap: '0.5rem',
                p: '0.5rem',
              }}>
              <PublicRegistrationContent registration={registration} />
              <PublicRegistrationStatusBar registration={registration} refetchRegistration={refetchRegistration} />
            </Box>
          </ErrorBoundary>
        ) : (
          <NotPublished />
        )
      ) : (
        <NotFound />
      )}
    </>
  );
};

export default PublicRegistration;
