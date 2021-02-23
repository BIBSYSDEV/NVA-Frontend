import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { getRegistrations } from '../../api/registrationApi';
import { LatestRegistration } from '../../types/search.types';
import useCancelToken from './useCancelToken';

const useFetchLatestRegistrations = (): [LatestRegistration[], boolean] => {
  const dispatch = useDispatch();
  const cancelToken = useCancelToken();
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrations = async () => {
      const registrations = await getRegistrations(cancelToken);
      if (registrations) {
        if (registrations.error) {
          dispatch(setNotification(registrations.error, NotificationVariant.Error));
        } else {
          setRegistrations(registrations);
        }
        setIsLoading(false);
      }
    };
    fetchRegistrations();
  }, [dispatch, cancelToken]);

  return [registrations, isLoading];
};

export default useFetchLatestRegistrations;
