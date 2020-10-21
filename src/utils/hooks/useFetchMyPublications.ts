import { useEffect, useState } from 'react';
import Axios from 'axios';
import { getMyRegistrations } from '../../api/registrationApi';
import { useDispatch } from 'react-redux';
import { RegistrationPreview } from '../../types/registration.types';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';

const useFetchMyPublications = (): [RegistrationPreview[], boolean] => {
  const dispatch = useDispatch();
  const [publications, setPublications] = useState<RegistrationPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cancelSource = Axios.CancelToken.source();

    const fetchMyPublications = async () => {
      const myPublications = await getMyRegistrations(cancelSource.token);
      if (myPublications) {
        setIsLoading(false);
        if (myPublications.error) {
          dispatch(setNotification(myPublications.error, NotificationVariant.Error));
        } else {
          setPublications(myPublications);
        }
      }
    };
    fetchMyPublications();

    return () => cancelSource.cancel();
  }, [dispatch]);

  return [publications, isLoading];
};

export default useFetchMyPublications;
