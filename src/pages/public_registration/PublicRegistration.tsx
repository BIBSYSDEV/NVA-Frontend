import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { StyledPageWrapperWithMaxWidth } from '../../components/styled/Wrappers';
import { RootStore } from '../../redux/reducers/rootReducer';
import { Registration, RegistrationStatus } from '../../types/registration.types';
import { userIsRegistrationCurator, userIsRegistrationOwner } from '../../utils/registration-helpers';
import NotFound from '../errorpages/NotFound';
import { NotPublished } from '../errorpages/NotPublished';
import { PageSpinner } from '../../components/PageSpinner';
import { PublicRegistrationContent } from './PublicRegistrationContent';
import { useFetch } from '../../utils/hooks/useFetch';
import { PublicationsApiPath } from '../../api/apiPaths';

const PublicRegistration = () => {
  const { t } = useTranslation();
  const { identifier } = useParams<{ identifier: string }>();
  const [registration, isLoadingRegistration, refetchRegistration] = useFetch<Registration>({
    url: `${PublicationsApiPath.Registration}/${identifier}`,
    errorMessage: t('feedback:error.get_registration'),
  });
  const user = useSelector((store: RootStore) => store.user);

  const isAllowedToSeePublicRegistration =
    registration?.status === RegistrationStatus.PUBLISHED ||
    userIsRegistrationOwner(user, registration) ||
    userIsRegistrationCurator(user, registration);

  return (
    <StyledPageWrapperWithMaxWidth>
      {isLoadingRegistration ? (
        <PageSpinner />
      ) : registration ? (
        isAllowedToSeePublicRegistration ? (
          <PublicRegistrationContent registration={registration} refetchRegistration={refetchRegistration} />
        ) : (
          <NotPublished />
        )
      ) : (
        <NotFound />
      )}
    </StyledPageWrapperWithMaxWidth>
  );
};

export default PublicRegistration;
