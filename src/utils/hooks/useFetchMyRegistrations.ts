import { useEffect, useState } from 'react';
import Axios from 'axios';
import { getMyRegistrations } from '../../api/registrationApi';
import { useDispatch } from 'react-redux';
import { RegistrationPreview } from '../../types/registration.types';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';

const useFetchMyRegistrations = (): [RegistrationPreview[], boolean] => {
  const dispatch = useDispatch();
  const [registrations, setRegistrations] = useState<RegistrationPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cancelSource = Axios.CancelToken.source();

    const fetchMyRegistrations = async () => {
      const myRegistrations = await getMyRegistrations(cancelSource.token);
      if (myRegistrations) {
        setIsLoading(false);
        if (myRegistrations.error) {
          dispatch(setNotification(myRegistrations.error, NotificationVariant.Error));
        } else {
          setRegistrations(myRegistrations);
        }
      }
    };
    fetchMyRegistrations();

    return () => cancelSource.cancel();
  }, [dispatch]);

  return [registrations, isLoading];
};

export default useFetchMyRegistrations;
