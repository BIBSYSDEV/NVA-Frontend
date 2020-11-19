import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { getAuthority } from '../../api/authorityApi';
import { Authority } from '../../types/authority.types';
import useCancelToken from './useCancelToken';

const useFetchAuthority = (arpId: string): [Authority | undefined, boolean] => {
  const dispatch = useDispatch();
  const { t } = useTranslation('feedback');
  const [authority, setAuthority] = useState<Authority>();
  const [isLoading, setIsLoading] = useState(true);
  const cancelToken = useCancelToken();

  useEffect(() => {
    if (arpId) {
      const fetchAuthority = async () => {
        const fetchedAuthority = await getAuthority(arpId, cancelToken);
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
    }
  }, [dispatch, t, cancelToken, arpId]);

  return [authority, isLoading];
};

export default useFetchAuthority;
