import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Axios from 'axios';

import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { getDoiRequests } from '../../api/publicationApi';

export interface DoiRequest {
  doiRequestStatus: string;
  doiRequestDate: string;
  publicationIdentifier: string;
  publicationTitle: string;
  publicationCreator: string;
}

const useFetchDoiRequests = (): [DoiRequest[], boolean] => {
  const dispatch = useDispatch();
  const [doiRequests, setDoiRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cancelSource = Axios.CancelToken.source();

    const fetchDoiRequests = async () => {
      const response = await getDoiRequests(cancelSource.token);
      if (response) {
        if (response.error) {
          dispatch(setNotification(response.error, NotificationVariant.Error));
        } else {
          dispatch(setDoiRequests(response));
        }
        setIsLoading(false);
      }
    };

    fetchDoiRequests();

    return () => cancelSource.cancel();
  }, [dispatch]);

  return [doiRequests, isLoading];
};

export default useFetchDoiRequests;
