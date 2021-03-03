import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { StyledPageWrapperWithMaxWidth } from '../../components/styled/Wrappers';
import { RootStore } from '../../redux/reducers/rootReducer';
import { RegistrationStatus } from '../../types/registration.types';
import useFetchRegistration from '../../utils/hooks/useFetchRegistration';
import { userIsRegistrationCurator, userIsRegistrationOwner } from '../../utils/registration-helpers';
import NotFound from '../errorpages/NotFound';
import NotPublished from '../errorpages/NotPublished';
import PublicRegistrationContent from './PublicRegistrationContent';
import { PageSpinner } from '../../components/PageSpinner';

const PublicRegistration: FC = () => {
  const { identifier } = useParams<{ identifier: string }>();
  const [registration, isLoadingRegistration, refetchRegistration] = useFetchRegistration(identifier);
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
