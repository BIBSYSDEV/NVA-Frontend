import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Axios from 'axios';

import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { Publication } from '../../types/publication.types';
import { getRegistration } from '../../api/registrationApi';
import { RootStore } from '../../redux/reducers/rootReducer';

const useFetchPublication = (
  identifier: string | undefined
): [Publication | undefined, boolean, (values: Publication) => void] => {
  const dispatch = useDispatch();
  const [publication, setPublication] = useState<Publication>();
  const [isLoading, setIsLoading] = useState(!!identifier);
  const user = useSelector((store: RootStore) => store.user);

  const handleSetPublication = (values: Publication) => {
    setPublication(values);
  };

  useEffect(() => {
    const cancelSource = Axios.CancelToken.source();

    const fetchPublication = async () => {
      const publication = await getRegistration(identifier!, cancelSource.token);
      if (publication) {
        if (publication.error) {
          dispatch(setNotification(publication.error, NotificationVariant.Error));
        } else {
          setPublication(publication);
        }
        setIsLoading(false);
      }
    };
    if (identifier) {
      fetchPublication();
    }

    return () => {
      if (identifier) {
        cancelSource.cancel();
      }
    };
  }, [dispatch, identifier, user]);

  return [publication, isLoading, handleSetPublication];
};

export default useFetchPublication;
