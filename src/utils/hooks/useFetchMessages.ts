import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { RoleName } from '../../types/user.types';
import useCancelToken from './useCancelToken';
import { getMessages } from '../../api/registrationApi';
import { Message } from '../../types/publication_types/messages.types';

export const useFetchMessages = (role: RoleName): [Message[], boolean, () => void] => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const cancelToken = useCancelToken();
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);

  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    const response = await getMessages(role, cancelToken);
    if (response) {
      if (response.error) {
        //TODO
        dispatch(setNotification(t('feedback:error.get_doi_requests'), NotificationVariant.Error));
      } else if (response.data) {
        setMessages(response.data);
      }
      setIsLoading(false);
    }
  }, [t, dispatch, cancelToken, role]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return [messages, isLoading, fetchMessages];
};
