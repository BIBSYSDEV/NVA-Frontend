import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Axios from 'axios';

import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { Registration } from '../../types/registration.types';
import { getRegistration } from '../../api/registrationApi';
import { RootStore } from '../../redux/reducers/rootReducer';

const useFetchRegistration = (
  identifier: string | undefined
): [Registration | undefined, boolean, (values: Registration) => void] => {
  const dispatch = useDispatch();
  const [registration, setRegistration] = useState<Registration>();
  const [isLoading, setIsLoading] = useState(!!identifier);
  const user = useSelector((store: RootStore) => store.user);

  const handleSetRegistration = (values: Registration) => {
    setRegistration(values);
  };

  useEffect(() => {
    const cancelSource = Axios.CancelToken.source();

    const fetchPublication = async () => {
      const publication = await getRegistration(identifier!, cancelSource.token);
      if (publication) {
        if (publication.error) {
          dispatch(setNotification(publication.error, NotificationVariant.Error));
        } else {
          setRegistration(publication);
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

  return [registration, isLoading, handleSetRegistration];
};

export default useFetchRegistration;
