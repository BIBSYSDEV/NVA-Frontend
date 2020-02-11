import React, { FC, useEffect, useState } from 'react';
import { getPublication } from '../../api/publicationApi';
import { addNotification } from '../../redux/actions/notificationActions';
import i18n from '../../translations/i18n';
import { useDispatch } from 'react-redux';
import { CircularProgress } from '@material-ui/core';
import { emptyPublication, Publication } from '../../types/publication.types';

interface PublicationPageProps {
  publicationId: string;
}

const PublicationPage: FC<PublicationPageProps> = ({ publicationId }) => {
  const dispatch = useDispatch();
  const [isLoadingPublication, setIsLoadingPublication] = useState(false);
  const [publication, setPublication] = useState<Publication>(emptyPublication);

  useEffect(() => {
    const loadData = async () => {
      setIsLoadingPublication(true);
      const publication = await getPublication(publicationId);
      if (publication?.error) {
        dispatch(addNotification(i18n.t('feedback:error.get_publications'), 'error'));
      } else {
        setPublication(publication);
      }
      setIsLoadingPublication(false);
    };
    loadData();
  }, [dispatch, publicationId]);

  return (
    <>{isLoadingPublication ? <CircularProgress color="inherit" size={20} /> : <p>Retrieved: {publication.id}</p>}</>
  );
};

export default PublicationPage;
