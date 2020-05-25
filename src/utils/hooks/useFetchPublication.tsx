import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Axios from 'axios';

import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { Publication } from '../../types/publication.types';
import { getPublication } from '../../api/publicationApi';

const useFetchPublication = (identifier: string): [Publication | undefined, boolean] => {
  const dispatch = useDispatch();
  const [publication, setPublication] = useState<Publication | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cancelSource = Axios.CancelToken.source();

    const fetchPublication = async () => {
      const publication = await getPublication(identifier, cancelSource.token);
      if (publication) {
        setIsLoading(false);
        if (publication.error) {
          dispatch(setNotification(publication.error, NotificationVariant.Error));
        } else {
          setPublication(publication);
        }
      }
    };

    fetchPublication();

    return () => cancelSource.cancel();
  }, [dispatch, identifier]);

  return [publication, isLoading];
};

export default useFetchPublication;
