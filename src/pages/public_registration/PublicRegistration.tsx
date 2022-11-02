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
import { PublicRegistrationStatusBar } from './PublicRegistrationStatusBar';
import { SyledPageContent } from '../../components/styled/Wrappers';

const PublicRegistration = () => {
  const { t } = useTranslation();
  const { identifier } = useParams<RegistrationParams>();
  const [registration, isLoadingRegistration, refetchRegistration] = useFetch<Registration>({
    url: `${PublicationsApiPath.Registration}/${identifier}`,
    errorMessage: t('feedback.error.get_registration'),
  });
  const user = useSelector((store: RootState) => store.user);

  const isRegistrationAdmin = !!registration && userCanEditRegistration(user, registration);
  const isAllowedToSeePublicRegistration = registration?.status === RegistrationStatus.Published || isRegistrationAdmin;

  return (
    <SyledPageContent>
      {isLoadingRegistration ? (
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
                <PublicRegistrationStatusBar registration={registration} refetchRegistration={refetchRegistration} />
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
    </SyledPageContent>
  );
};

export default PublicRegistration;
