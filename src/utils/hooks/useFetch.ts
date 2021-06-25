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

export const isErrorStatus = (status: number) => status >= 400 && status <= 599;
export const isSuccessStatus = (status: number) => status >= 200 && status <= 299;

export const useFetch = <T>({
  url,
  errorMessage,
  withAuthentication = false,
}: UseFetchConfig): [T | undefined, boolean, () => void] => {
  const dispatch = useDispatch();
  const { t } = useTranslation('feedback');
  const [data, setData] = useState<T>();
  const [isLoading, setIsLoading] = useState(false);
  const cancelToken = useCancelToken();

  const showErrorNotification = useCallback(
    () =>
      dispatch(
        setNotification(
          errorMessage ?? t('error.fetch', { resource: url, interpolation: { escapeValue: false } }),
          NotificationVariant.Error
        )
      ),
    [dispatch, t, errorMessage, url]
  );

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const fetchedData = withAuthentication
        ? await authenticatedApiRequest2<T>({ url, cancelToken })
        : await apiRequest2<T>({ url, cancelToken });

      if (isErrorStatus(fetchedData.status)) {
        showErrorNotification();
      } else if (isSuccessStatus(fetchedData.status) && fetchedData.data) {
        setData(fetchedData.data);
      }
    } catch {
      showErrorNotification();
    } finally {
      setIsLoading(false);
    }
  }, [showErrorNotification, cancelToken, withAuthentication, url]);

  useEffect(() => {
    if (url) {
      fetchData();
    }
  }, [dispatch, t, fetchData, url]);

  return [data, isLoading, fetchData];
};
