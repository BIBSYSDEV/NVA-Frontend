import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import useCancelToken from './useCancelToken';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { apiRequest2, authenticatedApiRequest2 } from '../../api/apiRequest';

interface UseFetchConfig {
  url: string;
  errorMessage?: string;
  withAuthentication?: boolean;
}

export const useFetch = <T>({
  url,
  errorMessage,
  withAuthentication = false,
}: UseFetchConfig): [T | undefined, boolean] => {
  const dispatch = useDispatch();
  const { t } = useTranslation('feedback');
  const [data, setData] = useState<T>();
  const [isLoading, setIsLoading] = useState(false);
  const cancelToken = useCancelToken();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const fetchedData = withAuthentication
      ? await authenticatedApiRequest2<T>({ url, cancelToken })
      : await apiRequest2<T>({ url, cancelToken });

    if (fetchedData) {
      if (fetchedData.status >= 400 && fetchedData.status <= 599) {
        dispatch(
          setNotification(
            errorMessage ?? t('error.fetch', { resource: url, interpolation: { escapeValue: false } }),
            NotificationVariant.Error
          )
        );
      } else if (fetchedData.data) {
        setData(fetchedData.data);
      }
    }
    setIsLoading(false);
  }, [dispatch, t, cancelToken, withAuthentication, errorMessage, url]);

  useEffect(() => {
    if (url) {
      fetchData();
    }
  }, [dispatch, t, fetchData, url]);

  return [data, isLoading];
};
