import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { RoleName } from '../../types/user.types';
import useCancelToken from './useCancelToken';
import { getRegistrationsWithPendingDoiRequest } from '../../api/doiRequestApi';
import { Registration } from '../../types/registration.types';

const useFetchRegistrationsWithPendingDoiRequest = (role: RoleName): [Registration[], boolean, () => void] => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const cancelToken = useCancelToken();
  const [isLoading, setIsLoading] = useState(true);
  const [registrationsWithPendingDoiRequest, setRegistrationsWithPendingDoiRequest] = useState<Registration[]>([]);

  const fetchDoiRequests = useCallback(async () => {
    setIsLoading(true);
    const response = await getRegistrationsWithPendingDoiRequest(role, cancelToken);
    if (response) {
      if (response.error) {
        dispatch(setNotification(t('feedback:error.get_doi_requests'), NotificationVariant.Error));
      } else if (response.data) {
        setRegistrationsWithPendingDoiRequest(response.data);
      }
      setIsLoading(false);
    }
  }, [t, dispatch, cancelToken, role]);

  useEffect(() => {
    fetchDoiRequests();
  }, [fetchDoiRequests]);

  return [registrationsWithPendingDoiRequest, isLoading, fetchDoiRequests];
};

export default useFetchRegistrationsWithPendingDoiRequest;
