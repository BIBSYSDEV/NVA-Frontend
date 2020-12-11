import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { Registration } from '../../types/registration.types';
import { getRegistration } from '../../api/registrationApi';
import useCancelToken from './useCancelToken';

const useFetchRegistration = (identifier: string): [Registration | undefined, boolean, () => void] => {
  const dispatch = useDispatch();
  const [registration, setRegistration] = useState<Registration>();
  const [isLoading, setIsLoading] = useState(!!identifier);
  const cancelToken = useCancelToken();

  const fetchRegistration = useCallback(async () => {
    setIsLoading(true);
    const registration = await getRegistration(identifier, cancelToken);
    if (registration) {
      if (registration.error) {
        dispatch(setNotification(registration.error, NotificationVariant.Error));
      } else {
        setRegistration(registration);
      }
      setIsLoading(false);
    }
  }, [dispatch, cancelToken, identifier]);

  useEffect(() => {
    if (identifier) {
      fetchRegistration();
    }
  }, [fetchRegistration, identifier]);

  return [registration, isLoading, fetchRegistration];
};

export default useFetchRegistration;
