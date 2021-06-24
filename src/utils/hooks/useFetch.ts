import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import useCancelToken from './useCancelToken';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { apiRequest2, authenticatedApiRequest2 } from '../../api/apiRequest';

export const useFetch = <T>(requestUrl: string, withAuthentication = false): [T | undefined, boolean] => {
  const dispatch = useDispatch();
  const { t } = useTranslation('feedback');
  const [data, setData] = useState<T>();
  const [isLoading, setIsLoading] = useState(false);
  const cancelToken = useCancelToken();

  const fetchData = useCallback(
    async (url: string) => {
      setIsLoading(true);
      const fetchedData = withAuthentication
        ? await authenticatedApiRequest2<T>({ url, cancelToken })
        : await apiRequest2<T>({ url, cancelToken });

      if (fetchedData) {
        if (fetchedData.status >= 400 && fetchedData.status <= 599) {
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
    },
    [dispatch, t, cancelToken, withAuthentication]
  );

  useEffect(() => {
    if (requestUrl) {
      fetchData(requestUrl);
    }
  }, [dispatch, t, fetchData, requestUrl]);

  return [data, isLoading];
};
