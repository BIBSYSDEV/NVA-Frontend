import { AlmaRegistration } from '../../types/registration.types';
import { useEffect, useState } from 'react';
import { getAlmaRegistration } from '../../api/almaApi';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { useDispatch } from 'react-redux';
import Axios from 'axios';

const useFetchLastRegistrationFromAlma = (
  systemControlNumber: string,
  name: string
): [AlmaRegistration | null, boolean] => {
  const dispatch = useDispatch();
  const [almaRegistration, setAlmaRegistration] = useState<AlmaRegistration | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cancelSource = Axios.CancelToken.source();

    const fetchLastRegistration = async () => {
      const retrievedRegistration = await getAlmaRegistration(systemControlNumber, name, cancelSource.token);
      if (retrievedRegistration) {
        setIsLoading(false);
        if (retrievedRegistration.error) {
          dispatch(setNotification(retrievedRegistration.error, NotificationVariant.Error));
        } else {
          setAlmaRegistration(retrievedRegistration);
        }
      }
    };
    if (systemControlNumber && name) {
      fetchLastRegistration();
    }
    return () => {
      if (systemControlNumber && name) {
        cancelSource.cancel();
      }
    };
  }, [dispatch, name, systemControlNumber]);

  return [almaRegistration, isLoading];
};

export default useFetchLastRegistrationFromAlma;
