import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Axios from 'axios';

import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { getAuthority } from '../../api/authorityApi';
import { Authority } from '../../types/authority.types';
import { useTranslation } from 'react-i18next';

const useFetchAuthority = (arpId: string): [Authority | undefined, boolean] => {
  const dispatch = useDispatch();
  const { t } = useTranslation('feedback');
  const [authority, setAuthority] = useState<Authority>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cancelSource = Axios.CancelToken.source();

    const fetchAuthority = async () => {
      const fetchedAuthority = await getAuthority(arpId, cancelSource.token);
      if (fetchedAuthority) {
        setIsLoading(false);
        if (fetchedAuthority.error) {
          dispatch(setNotification(t('error.get_authority'), NotificationVariant.Error));
        } else if (fetchedAuthority.data) {
          setAuthority(fetchedAuthority.data);
        }
      }
    };
    fetchAuthority();

    return () => cancelSource.cancel();
  }, [dispatch, t, arpId]);

  return [authority, isLoading];
};

export default useFetchAuthority;
