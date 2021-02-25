import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AlmaRegistration } from '../../types/registration.types';
import { useEffect, useState } from 'react';
import { getAlmaRegistration } from '../../api/almaApi';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import useCancelToken from './useCancelToken';

const useFetchLastRegistrationFromAlma = (arpId: string, name: string): [AlmaRegistration | null, boolean] => {
  const dispatch = useDispatch();
  const cancelToken = useCancelToken();
  const [almaRegistration, setAlmaRegistration] = useState<AlmaRegistration | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation('feedback');

  useEffect(() => {
    const fetchLastRegistration = async () => {
      const retrievedRegistration = await getAlmaRegistration(arpId, name, cancelToken);
      if (retrievedRegistration) {
        if (retrievedRegistration.error) {
          dispatch(setNotification(t('error.get_last_registration'), NotificationVariant.Error));
        } else if (retrievedRegistration.data) {
          setAlmaRegistration(retrievedRegistration.data);
        }
        setIsLoading(false);
      }
    };
    if (arpId && name) {
      fetchLastRegistration();
    }
  }, [dispatch, cancelToken, name, arpId, t]);

  return [almaRegistration, isLoading];
};

export default useFetchLastRegistrationFromAlma;
