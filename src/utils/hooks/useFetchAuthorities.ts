import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { getAuthorities } from '../../api/authorityApi';
import { Authority } from '../../types/authority.types';
import useCancelToken from './useCancelToken';
import { useTranslation } from 'react-i18next';

const useFetchAuthorities = (searchTerm: string): [Authority[] | undefined, boolean] => {
  const dispatch = useDispatch();
  const { t } = useTranslation('feedback');
  const [authorities, setAuthorities] = useState<Authority[]>();
  const [isLoading, setIsLoading] = useState(false);
  const cancelToken = useCancelToken();

  useEffect(() => {
    const fetchAuthorities = async () => {
      setIsLoading(true);
      const fetchedAuthorities = await getAuthorities(searchTerm, cancelToken);
      if (fetchedAuthorities) {
        if (fetchedAuthorities.error) {
          dispatch(setNotification(t('feedback:error.get_authorities'), NotificationVariant.Error));
        } else if (fetchedAuthorities.data) {
          setAuthorities(fetchedAuthorities.data);
        }
        setIsLoading(false);
      }
    };
    if (searchTerm) {
      fetchAuthorities();
    }
  }, [t, dispatch, cancelToken, searchTerm]);

  return [authorities, isLoading];
};

export default useFetchAuthorities;
