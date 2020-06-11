import React, { FC, useEffect } from 'react';
import { CircularProgress } from '@material-ui/core';

import { PublicationStatus } from '../../../types/publication.types';
import ContentPage from '../../../components/ContentPage';
import { useParams, useHistory } from 'react-router-dom';
import useFetchPublication from '../../../utils/hooks/useFetchPublication';
import { useSelector } from 'react-redux';
import { RootStore } from '../../../redux/reducers/rootReducer';
import PublicPublicationContent from './PublicPublicationContent';
import NotPublished from '../../errorpages/NotPublished';

const PublicPublication: FC = () => {
  const { identifier } = useParams();
  const [publication, isLoadingPublication] = useFetchPublication(identifier);
  const user = useSelector((store: RootStore) => store.user);
  const history = useHistory();

  useEffect(() => {
    history.replace(`/publication/${identifier}/public`, {
      title: publication?.entityDescription?.mainTitle ?? identifier,
    });
  }, [publication, history, identifier, user]);

  return (
    <>
      {isLoadingPublication ? (
        <CircularProgress color="inherit" size={20} />
      ) : (
        publication && (
          <ContentPage>
            {publication.status === PublicationStatus.PUBLISHED ? (
              <PublicPublicationContent publication={publication} />
            ) : (
              <NotPublished publicationId={publication.identifier} />
            )}
          </ContentPage>
        )
      )}
    </>
  );
};

export default PublicPublication;
