import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Axios from 'axios';

import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { PublicationListItem } from '../../types/publication.types';
import { getPublications } from '../../api/publicationApi';

const useFetchLatestPublications = (): [PublicationListItem[], boolean] => {
  const dispatch = useDispatch();
  const [publications, setPublications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cancelSource = Axios.CancelToken.source();

    const fetchPublications = async () => {
      const publications = await getPublications(cancelSource.token);
      if (publications) {
        if (publications.error) {
          dispatch(setNotification(publications.error, NotificationVariant.Error));
        } else {
          setPublications(publications);
        }
        setIsLoading(false);
      }
    };
    fetchPublications();

    return () => {
      cancelSource.cancel();
    };
  }, [dispatch]);

  return [publications, isLoading];
};

export default useFetchLatestPublications;
