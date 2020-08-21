import React, { FC, useEffect } from 'react';
import { CircularProgress } from '@material-ui/core';

import { PublicationStatus } from '../../../types/publication.types';
import { useParams, useHistory } from 'react-router-dom';
import useFetchPublication from '../../../utils/hooks/useFetchPublication';
import PublicPublicationContent from './PublicPublicationContent';
import NotPublished from '../../errorpages/NotPublished';
import NotFound from '../../errorpages/NotFound';

const PublicPublication: FC = () => {
  const { identifier } = useParams<{ identifier: string }>();
  const [publication, isLoadingPublication] = useFetchPublication(identifier);
  const history = useHistory();

  useEffect(() => {
    history.replace(`/publication/${identifier}/public`, {
      title: publication?.entityDescription?.mainTitle,
    });
  }, [publication, history, identifier]);

  return (
    <>
      {isLoadingPublication ? (
        <CircularProgress color="inherit" size={20} />
      ) : publication ? (
        publication.status === PublicationStatus.PUBLISHED ? (
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
