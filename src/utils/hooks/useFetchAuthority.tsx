import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Axios from 'axios';

import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { getAuthority } from '../../api/authorityApi';
import { Authority } from '../../types/authority.types';

const useFetchAuthority = (arpId: string): [Authority | undefined, boolean] => {
  const dispatch = useDispatch();
  const [authority, setAuthority] = useState<Authority | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const cancelSource = Axios.CancelToken.source();

    const fetchAuthority = async () => {
      setIsLoading(true);
      const fetchedAuthority = await getAuthority(arpId, cancelSource.token);
      if (fetchedAuthority?.error) {
        dispatch(setNotification(fetchedAuthority.error, NotificationVariant.Error));
      } else {
        setAuthority(fetchedAuthority);
      }
      setIsLoading(false);
    };
    fetchAuthority();

    return () => cancelSource.cancel();
  }, [dispatch, arpId]);

  return [authority, isLoading];
};

export default useFetchAuthority;
