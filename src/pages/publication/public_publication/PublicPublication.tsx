import React, { FC, useEffect } from 'react';
import { CircularProgress } from '@material-ui/core';

import { PublicationStatus } from '../../../types/publication.types';
import { useParams, useHistory } from 'react-router-dom';
import useFetchPublication from '../../../utils/hooks/useFetchPublication';
import PublicPublicationContent from './PublicPublicationContent';
import NotPublished from '../../errorpages/NotPublished';
import NotFound from '../../errorpages/NotFound';
import { useSelector } from 'react-redux';
import { RootStore } from '../../../redux/reducers/rootReducer';

const PublicPublication: FC = () => {
  const { identifier } = useParams();
  const [publication, isLoadingPublication] = useFetchPublication(identifier);
  const history = useHistory();
  const user = useSelector((store: RootStore) => store.user);

  useEffect(() => {
    if (publication) {
      history.replace(`/registration/${identifier}/public`, {
        title: publication.entityDescription.mainTitle,
      });
    }
  }, [publication, history, identifier]);

  const isAllowedToSeePublicPublication =
    publication?.status === PublicationStatus.PUBLISHED || user?.isCurator || publication?.owner === user?.id;

  return (
    <>
      {isLoadingPublication ? (
        <CircularProgress color="inherit" size={20} />
      ) : publication ? (
        isAllowedToSeePublicPublication ? (
          <PublicPublicationContent publication={publication} />
        ) : (
          <NotPublished />
        )
      ) : (
        <NotFound />
      )}
    </>
  );
};

export default PublicPublication;
