import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Axios from 'axios';

import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { getAuthorities } from '../../api/authorityApi';
import { Authority } from '../../types/authority.types';

const useFetchAuthorities = (
  initialSearchTerm: string | undefined
): [Authority[] | undefined, boolean, (searchTerm: string) => void, string | undefined] => {
  const dispatch = useDispatch();
  const [authorities, setAuthorities] = useState<Authority[] | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  const handleNewSearchTerm = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  console.log('searchTerm', searchTerm);

  useEffect(() => {
    const cancelSource = Axios.CancelToken.source();
    const fetchAuthorities = async () => {
      setIsLoading(true);
      const fetchedAuthorities = await getAuthorities(searchTerm!, cancelSource.token);
      console.log('fetched authorities');
      if (fetchedAuthorities) {
        setIsLoading(false);
        if (fetchedAuthorities.error) {
          dispatch(setNotification(fetchedAuthorities.error, NotificationVariant.Error));
        } else {
          setAuthorities(fetchedAuthorities);
        }
      }
    };
    if (searchTerm) {
      fetchAuthorities();
    }

    return () => {
      if (searchTerm) {
        cancelSource.cancel();
        console.log('cancelled fetch authority');
      }
    };
  }, [dispatch, searchTerm]);

  return [authorities, isLoading, handleNewSearchTerm, searchTerm];
};

export default useFetchAuthorities;
