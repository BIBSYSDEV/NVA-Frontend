import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { searchRegistrations } from '../../api/searchApi';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { SearchResult } from '../../types/search.types';
import useCancelToken from './useCancelToken';

const useSearchRegistrations = (
  searchTerm?: string,
  numberOfResults?: number,
  searchAfter?: number
): [SearchResult | undefined, boolean] => {
  const dispatch = useDispatch();
  const { t } = useTranslation('feedback');
  const cancelToken = useCancelToken();
  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<SearchResult>();

  useEffect(() => {
    const handleSearchRegistrations = async () => {
      setIsLoading(true);
      const response = await searchRegistrations(searchTerm, numberOfResults, searchAfter, cancelToken);
      if (response) {
        if (response.error) {
          dispatch(setNotification(t('error.search'), NotificationVariant.Error));
        } else if (response.data) {
          setSearchResults(response.data);
        }
      }
      setIsLoading(false);
    };

    handleSearchRegistrations();
  }, [searchTerm, numberOfResults, searchAfter, cancelToken, t, dispatch]);

  return [searchResults, isLoading];
};

export default useSearchRegistrations;
