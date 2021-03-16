import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { RoleName } from '../../types/user.types';
import useCancelToken from './useCancelToken';
import { getMessages } from '../../api/registrationApi';
import { SupportRequest } from '../../types/publication_types/messages.types';

export const useFetchSupportRequests = (role: RoleName): [SupportRequest[], boolean, () => void] => {
  const dispatch = useDispatch();
  const { t } = useTranslation('feedback');
  const cancelToken = useCancelToken();
  const [isLoading, setIsLoading] = useState(true);
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([]);

  const fetchSupportRequests = useCallback(async () => {
    setIsLoading(true);
    const response = await getMessages(role, cancelToken);
    if (response) {
      if (response.error) {
        dispatch(setNotification(t('error.get_messages'), NotificationVariant.Error));
      } else if (response.data) {
        setSupportRequests(response.data);
      }
      setIsLoading(false);
    }
  }, [t, dispatch, cancelToken, role]);

  useEffect(() => {
    fetchSupportRequests();
  }, [fetchSupportRequests]);

  return [supportRequests, isLoading, fetchSupportRequests];
};
