import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { Registration } from '../../types/registration.types';
import { getRegistration } from '../../api/registrationApi';
import useCancelToken from './useCancelToken';

const useFetchRegistration = (identifier: string): [Registration | undefined, boolean, () => void] => {
  const { t } = useTranslation('feedback');
  const dispatch = useDispatch();
  const [registration, setRegistration] = useState<Registration>();
  const [isLoading, setIsLoading] = useState(!!identifier);
  const cancelToken = useCancelToken();

  const fetchRegistration = useCallback(async () => {
    setIsLoading(true);
    const registrationResponse = await getRegistration(identifier, cancelToken);
    if (registrationResponse) {
      if (registrationResponse.error) {
        dispatch(setNotification(t('error.get_registration'), NotificationVariant.Error));
      } else {
        setRegistration(registrationResponse.data);
      }
      setIsLoading(false);
    }
  }, [t, dispatch, cancelToken, identifier]);

  useEffect(() => {
    if (identifier) {
      fetchRegistration();
    }
  }, [fetchRegistration, identifier]);

  return [registration, isLoading, fetchRegistration];
};

export default useFetchRegistration;
