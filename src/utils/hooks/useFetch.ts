import Axios from 'axios';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useCancelToken } from './useCancelToken';
import { setNotification } from '../../redux/notificationSlice';
import { apiRequest, authenticatedApiRequest } from '../../api/apiRequest';
import { isErrorStatus, isSuccessStatus } from '../constants';

interface UseFetchConfig {
  url: string;
  errorMessage?: string | false;
  withAuthentication?: boolean;
}

/**
 * @deprecated Use react-query instead
 */
export const useFetch = <T>({
  url,
  errorMessage,
  withAuthentication = false,
}: UseFetchConfig): [T | undefined, boolean, () => void, (value: T) => void] => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [data, setData] = useState<T>();
  const [isLoading, setIsLoading] = useState(!!url);
  const cancelToken = useCancelToken();

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

  const shouldShowErrorMessage = errorMessage !== false;

  const showErrorNotification = useCallback(() => {
    if (shouldShowErrorMessage) {
      dispatch(
        setNotification({
          message:
            (errorMessageRef.current as string | undefined) ??
            tRef.current('feedback.error.fetch', { resource: url, interpolation: { escapeValue: false } }),
          variant: 'error',
        })
      );
    }
  }, [dispatch, shouldShowErrorMessage, url]);

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
    } catch (error) {
      if (!Axios.isCancel(error)) {
        showErrorNotification();
      }
    } finally {
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
