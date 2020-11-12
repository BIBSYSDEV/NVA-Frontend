import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Axios from 'axios';

import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { getAuthorities } from '../../api/authorityApi';
import { Authority } from '../../types/authority.types';

const useFetchAuthorities = (searchTerm: string): [Authority[] | undefined, boolean] => {
  const dispatch = useDispatch();
  const [authorities, setAuthorities] = useState<Authority[]>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const cancelSource = Axios.CancelToken.source();
    const fetchAuthorities = async () => {
      setIsLoading(true);
      const fetchedAuthorities = await getAuthorities(searchTerm, cancelSource.token);
      if (fetchedAuthorities) {
        if (fetchedAuthorities.error) {
          dispatch(setNotification(fetchedAuthorities.error, NotificationVariant.Error));
        } else {
          setAuthorities(fetchedAuthorities);
        }
        setIsLoading(false);
      }
    };
    if (searchTerm) {
      fetchAuthorities();
    }

    return () => {
      if (searchTerm) {
        cancelSource.cancel();
      }
    };
  }, [dispatch, searchTerm]);

  return [authorities, isLoading];
};

export default useFetchAuthorities;
