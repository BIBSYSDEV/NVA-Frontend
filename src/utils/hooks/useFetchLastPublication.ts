import { AlmaPublication } from '../../types/publication.types';
import { useEffect, useState } from 'react';
import { getAlmaPublication } from '../../api/almaApi';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { useDispatch } from 'react-redux';
import Axios from 'axios';

const useFetchLastPublication = (systemControlNumber: string, name: string): [AlmaPublication | null, boolean] => {
  const dispatch = useDispatch();
  const [publication, setPublication] = useState<AlmaPublication | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cancelSource = Axios.CancelToken.source();

    const fetchLastPublication = async () => {
      const retrievedPublication = await getAlmaPublication(systemControlNumber, name);
      if (retrievedPublication) {
        setIsLoading(false);
        if (retrievedPublication.error) {
          dispatch(setNotification(retrievedPublication.error, NotificationVariant.Error));
        } else {
          setPublication(retrievedPublication);
        }
      }
    };
    if (systemControlNumber && name) {
      fetchLastPublication();
    }
    return () => {
      if (systemControlNumber && name) {
        cancelSource.cancel();
      }
    };
  }, [dispatch, name, systemControlNumber]);

  return [publication, isLoading];
};

export default useFetchLastPublication;
