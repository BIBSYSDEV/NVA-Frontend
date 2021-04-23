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
        if (fetchedData.error) {
          dispatch(
            setNotification(
              t('error.fetch', { resource: url, interpolation: { escapeValue: false } }),
              NotificationVariant.Error
            )
          );
        } else if (fetchedData.data) {
          setData(fetchedData.data);
        }
      }
      setIsLoading(false);
    };
    if (url) {
      fetchData();
    }
  }, [dispatch, t, cancelToken, url, withAuthentication]);

  return [data, isLoading];
};
