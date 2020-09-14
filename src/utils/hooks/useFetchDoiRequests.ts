import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { RoleName } from '../../types/user.types';
import { DoiRequest } from '../../types/doiRequest.types';
import useCancelToken from './useCancelToken';
import { getDoiRequests } from '../../api/doiRequestApi';

const useFetchDoiRequests = (role: RoleName): [DoiRequest[], boolean, () => void] => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const cancelToken = useCancelToken();
  const [isLoading, setIsLoading] = useState(true);
  const [doiRequests, setDoiRequests] = useState<DoiRequest[]>([]);

  const fetchDoiRequests = useCallback(async () => {
    setIsLoading(true);
    const response = await getDoiRequests(role, cancelToken);
    if (response) {
      if (response.error) {
        dispatch(setNotification(t('feedback:error.get_doi_requests'), NotificationVariant.Error));
      } else if (response.data) {
        setDoiRequests(response.data);
      }
      setIsLoading(false);
    }
  }, [t, dispatch, cancelToken, role]);

  useEffect(() => {
    fetchDoiRequests();
  }, [fetchDoiRequests]);

  return [doiRequests, isLoading, fetchDoiRequests];
};

export default useFetchDoiRequests;
