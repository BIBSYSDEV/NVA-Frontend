import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { RoleName } from '../../types/user.types';
import useCancelToken from './useCancelToken';
import { getPublicationsWithPendingDoiRequest } from '../../api/doiRequestApi';
import { Publication } from '../../types/publication.types';

const useFetchPublicationsWithPendingDoiRequest = (role: RoleName): [Publication[], boolean, () => void] => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const cancelToken = useCancelToken();
  const [isLoading, setIsLoading] = useState(true);
  const [publicationsWithPendingDoiRequest, setPublicationsWithPendingDoiRequest] = useState<Publication[]>([]);

  const fetchDoiRequests = useCallback(async () => {
    setIsLoading(true);
    const response = await getPublicationsWithPendingDoiRequest(role, cancelToken);
    if (response) {
      if (response.error) {
        dispatch(setNotification(t('feedback:error.get_doi_requests'), NotificationVariant.Error));
      } else if (response.data) {
        setPublicationsWithPendingDoiRequest(response.data);
      }
      setIsLoading(false);
    }
  }, [t, dispatch, cancelToken, role]);

  useEffect(() => {
    fetchDoiRequests();
  }, [fetchDoiRequests]);

  return [publicationsWithPendingDoiRequest, isLoading, fetchDoiRequests];
};

export default useFetchPublicationsWithPendingDoiRequest;
