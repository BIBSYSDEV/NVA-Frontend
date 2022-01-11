import Axios from 'axios';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useCancelToken } from './useCancelToken';
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
}: UseFetchConfig): [T | undefined, boolean, () => void, (value: T) => void] => {
  console.log('useFetch');
  const dispatch = useDispatch();
  const { t } = useTranslation('feedback');
  const [data, setData] = useState<T>();
  const [isLoading, setIsLoading] = useState(!!url);
  const cancelToken = useCancelToken();
  console.log('useFetch', data);

  const mountedRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Wrap t and errorMessage in refs to avoid reloading whole page when user changes language
  const tRef = useRef(t);
  useEffect(() => {
    tRef.current = t;
  }, [t]);

  const errorMessageRef = useRef(errorMessage);
  useEffect(() => {
    errorMessageRef.current = errorMessage;
  }, [errorMessage]);

  const showErrorNotification = useCallback(
    () =>
      dispatch(
        setNotification(
          errorMessageRef.current ??
            tRef.current('error.fetch', { resource: url, interpolation: { escapeValue: false } }),
          NotificationVariant.Error
        )
      ),
    [dispatch, url]
  );

  const fetchData = useCallback(async () => {
    try {
      console.log('fetchData');
      setIsLoading(true);
      const fetchedData = withAuthentication
        ? await authenticatedApiRequest<T>({ url, cancelToken })
        : await apiRequest<T>({ url, cancelToken });
      console.log('fetchedData', fetchedData);
      if (isErrorStatus(fetchedData.status)) {
        showErrorNotification();
      } else if (isSuccessStatus(fetchedData.status) && fetchedData.data) {
        setData(fetchedData.data);
      }
    } catch (error) {
      console.log('fetchData Error', error);
      if (!Axios.isCancel(error)) {
        console.log('!isCancel');
        showErrorNotification();
      }
    } finally {
      console.log('fetchData Finally');
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [showErrorNotification, cancelToken, withAuthentication, url]);

  useEffect(() => {
    if (url) {
      fetchData();
    } else {
      setData(undefined);
    }
  }, [fetchData, url]);

  return [data, isLoading, fetchData, setData];
};
