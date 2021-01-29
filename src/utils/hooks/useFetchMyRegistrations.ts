import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getMyRegistrations } from '../../api/registrationApi';
import { RegistrationPreview } from '../../types/registration.types';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import useCancelToken from './useCancelToken';
import { useTranslation } from 'react-i18next';

const useFetchMyRegistrations = (): [RegistrationPreview[], boolean, () => void] => {
  const dispatch = useDispatch();
  const { t } = useTranslation('feedback');
  const [registrations, setRegistrations] = useState<RegistrationPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const cancelToken = useCancelToken();

  const fetchMyRegistrations = useCallback(async () => {
    setIsLoading(true);
    const myRegistrations = await getMyRegistrations(cancelToken);
    if (myRegistrations) {
      if (myRegistrations.error) {
        dispatch(setNotification(t('feedback:error.get_registrations'), NotificationVariant.Error));
      } else {
        setRegistrations(myRegistrations.data?.publications ?? []);
      }
      setIsLoading(false);
    }
  }, [dispatch, t, cancelToken]);

  useEffect(() => {
    fetchMyRegistrations();
  }, [fetchMyRegistrations]);

  return [registrations, isLoading, fetchMyRegistrations];
};

export default useFetchMyRegistrations;
