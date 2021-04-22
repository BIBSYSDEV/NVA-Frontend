import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import useCancelToken from './useCancelToken';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { apiRequest, authenticatedApiRequest } from '../../api/apiRequest';

export const useFetch = <T>(url: string, withAuthentication = false): [T | undefined, boolean] => {
  const dispatch = useDispatch();
  const { t } = useTranslation('feedback');
  const [data, setData] = useState<T>();
  const [isLoading, setIsLoading] = useState(false);
  const cancelToken = useCancelToken();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const fetchedData = withAuthentication
        ? await authenticatedApiRequest<T>({ url, cancelToken })
        : await apiRequest<T>({ url, cancelToken });
      if (fetchedData) {
        setIsLoading(false);
        if (fetchedData.error) {
          dispatch(setNotification('Kunne ikke hente ' + url, NotificationVariant.Error)); // TODO: i18n
        } else if (fetchedData.data) {
          setData(fetchedData.data);
        }
      }
    };
    if (url) {
      fetchData();
    }
  }, [dispatch, t, cancelToken, url, withAuthentication]);

  return [data, isLoading];
};
