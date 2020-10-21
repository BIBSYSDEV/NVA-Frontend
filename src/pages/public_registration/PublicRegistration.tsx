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
  const [publication, isLoadingPublication] = useFetchRegistration(identifier);
  const user = useSelector((store: RootStore) => store.user);

  const isAllowedToSeePublicPublication =
    publication?.status === RegistrationStatus.PUBLISHED || (user?.isCurator && publication.publisher.id === user?.id) || publication?.owner === user?.id;

  return (
    <>
      {isLoadingPublication ? (
        <CircularProgress color="inherit" size={20} />
      ) : publication ? (
        isAllowedToSeePublicPublication ? (
          <PublicRegistrationContent publication={publication} />
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
