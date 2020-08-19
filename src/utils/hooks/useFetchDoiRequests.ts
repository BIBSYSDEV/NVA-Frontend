import { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Axios from 'axios';

import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { getDoiRequests } from '../../api/publicationApi';
import { RoleName } from '../../types/user.types';
import { DoiRequest } from '../../types/doiRequest.types';

const useFetchDoiRequests = (role: RoleName): [DoiRequest[], boolean, () => void] => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [doiRequests, setDoiRequests] = useState<DoiRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const cancelSourceRef = useRef(Axios.CancelToken.source());

  const fetchDoiRequests = useCallback(async () => {
    setIsLoading(true);
    const response = await getDoiRequests(role, cancelSourceRef.current.token);
    if (response) {
      if (response.error) {
        dispatch(setNotification(t('feedback:error.get_doi_requests'), NotificationVariant.Error));
      } else if (response.data) {
        dispatch(setDoiRequests(response.data));
      }
      setIsLoading(false);
    }
  }, [t, dispatch, role]);

  useEffect(() => {
    fetchDoiRequests();
    // Cancel request on unmount
    const cancelSource = cancelSourceRef.current;
    return () => cancelSource.cancel();
  }, [fetchDoiRequests, role]);

  return [doiRequests, isLoading, fetchDoiRequests];
};

export default useFetchDoiRequests;
