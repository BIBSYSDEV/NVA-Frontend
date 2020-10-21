import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Axios from 'axios';

import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { getRegistrations } from '../../api/registrationApi';
import { LatestRegistration } from '../../types/search.types';

const useFetchLatestRegistrations = (): [LatestRegistration[], boolean] => {
  const dispatch = useDispatch();
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cancelSource = Axios.CancelToken.source();

    const fetchPublications = async () => {
      const publications = await getRegistrations(cancelSource.token);
      if (publications) {
        if (publications.error) {
          dispatch(setNotification(publications.error, NotificationVariant.Error));
        } else {
          setRegistrations(publications);
        }
        setIsLoading(false);
      }
    };
    fetchPublications();

    return () => {
      cancelSource.cancel();
    };
  }, [dispatch]);

  return [registrations, isLoading];
};

export default useFetchLatestRegistrations;
