import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SyledPageContent } from '../../components/styled/Wrappers';
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

const PublicRegistration = () => {
  const { t } = useTranslation();
  const { identifier } = useParams<{ identifier: string }>();
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
    <SyledPageContent>
      {isLoadingRegistration ? (
        <PageSpinner />
      ) : registration ? (
        isAllowedToSeePublicRegistration ? (
          <ErrorBoundary>
            <PublicRegistrationContent registration={registration} refetchRegistration={refetchRegistration} />
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
