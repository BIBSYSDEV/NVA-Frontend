import Axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import useCancelToken from './useCancelToken';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { apiRequest, authenticatedApiRequest } from '../../api/apiRequest';
import { isErrorStatus, isSuccessStatus } from '../constants';

interface UseFetchConfig {
  url: string;
  errorMessage?: string;
  withAuthentication?: boolean;
}

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
        ? await authenticatedApiRequest<T>({ url, cancelToken })
        : await apiRequest<T>({ url, cancelToken });

      if (isErrorStatus(fetchedData.status)) {
        showErrorNotification();
      } else if (isSuccessStatus(fetchedData.status) && fetchedData.data) {
        setData(fetchedData.data);
      }
      setIsLoading(false);
    } catch (error) {
      if (!Axios.isCancel(error)) {
        showErrorNotification();
        setIsLoading(false);
      }
    }
  }, [showErrorNotification, cancelToken, withAuthentication, url]);

  useEffect(() => {
    if (url) {
      fetchData();
    }
  }, [dispatch, t, fetchData, url]);

  return [data, isLoading, fetchData];
};
