import React, { FC } from 'react';
import { CircularProgress } from '@material-ui/core';

import { RegistrationStatus } from '../../types/registration.types';
import { useParams } from 'react-router-dom';
import useFetchRegistration from '../../utils/hooks/useFetchRegistration';
import PublicRegistrationContent from './PublicRegistrationContent';
import NotPublished from '../errorpages/NotPublished';
import NotFound from '../errorpages/NotFound';
import { useSelector } from 'react-redux';
import { RootStore } from '../../redux/reducers/rootReducer';

const PublicRegistration: FC = () => {
  const { identifier } = useParams();
  const [registration, isLoadingRegistration] = useFetchRegistration(identifier);
  const user = useSelector((store: RootStore) => store.user);

  const isAllowedToSeePublicRegistration =
    registration?.status === RegistrationStatus.PUBLISHED ||
    (user?.isCurator && registration?.publisher.id === user?.id) ||
    registration?.owner === user?.id;

  return (
    <>
      {isLoadingRegistration ? (
        <CircularProgress color="inherit" size={20} />
      ) : registration ? (
        isAllowedToSeePublicRegistration ? (
          <PublicRegistrationContent registration={registration} />
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
