import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { isErrorStatus, isSuccessStatus, PublicationTableNumber } from '../constants';
import { Publisher } from '../../types/registration.types';
import { getPublishers } from '../../api/publicationChannelApi';
import { useDebounce } from './useDebounce';
import { useCancelToken } from './useCancelToken';
import { NotificationVariant } from '../../types/notification.types';
import { useTranslation } from 'react-i18next';
import { setNotification } from '../../redux/actions/notificationActions';

export const useFetchPublishers = (
  publicationTable: PublicationTableNumber,
  initialSearchTerm = ''
): [Publisher[], boolean, (searchTerm: string) => void] => {
  const dispatch = useDispatch();
  const { t } = useTranslation('feedback');
  const cancelToken = useCancelToken();
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const debouncedSearchTerm = useDebounce(searchTerm);

  const handleNewSearchTerm = (searchTerm: string) => setSearchTerm(searchTerm);

  useEffect(() => {
    const fetchPublishers = async () => {
      setIsLoading(true);
      const fetchedPublishersResponse = await getPublishers(debouncedSearchTerm, publicationTable, cancelToken);
      if (isErrorStatus(fetchedPublishersResponse.status)) {
        dispatch(setNotification(t('error.get_publishers'), NotificationVariant.Error));
      } else if (isSuccessStatus(fetchedPublishersResponse.status) && fetchedPublishersResponse.data) {
        setPublishers(fetchedPublishersResponse.data.results);
      }
      setIsLoading(false);
    };
    if (debouncedSearchTerm) {
      fetchPublishers();
    } else {
      setPublishers([]);
    }
  }, [dispatch, t, cancelToken, publicationTable, debouncedSearchTerm]);

  return [publishers, isLoading, handleNewSearchTerm];
};
