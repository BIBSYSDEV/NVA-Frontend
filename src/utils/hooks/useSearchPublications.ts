import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { search } from '../../api/publicationApi';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { SearchResult } from '../../types/search.types';
import useCancelToken from './useCancelToken';

const useSearchPublications = (
  searchTerm: string,
  numberOfResults?: number,
  searchAfter?: string
): [SearchResult[] | [], boolean] => {
  const dispatch = useDispatch();
  const { t } = useTranslation('feedback');
  const cancelToken = useCancelToken();
  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    const searchPublications = async () => {
      const response = await search(searchTerm, numberOfResults, searchAfter, cancelToken);
      if (response) {
        setIsLoading(false);
        if (response.error) {
          dispatch(setNotification(t('error.search'), NotificationVariant.Error));
        } else if (response.data) {
          setSearchResults(response.data);
        }
      }
    };
    searchPublications();
  }, [searchTerm, numberOfResults, searchAfter]);

  return [searchResults, isLoading];
};

export default useSearchPublications;
