import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { InstitutionUser } from '../../types/user.types';
import { getUsersForInstitution } from '../../api/roleApi';
import useCancelToken from './useCancelToken';

const useFetchUsersForInstitution = (customerId: string): [InstitutionUser[], boolean, () => void] => {
  const dispatch = useDispatch();
  const cancelToken = useCancelToken();
  const [users, setUsers] = useState<InstitutionUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchInstitutionUsers = useCallback(async () => {
    setIsLoading(true);
    const fetchedUsers = await getUsersForInstitution(customerId, cancelToken);
    if (fetchedUsers) {
      if (fetchedUsers.error) {
        dispatch(setNotification(fetchedUsers.error, NotificationVariant.Error));
      } else {
        setUsers(fetchedUsers);
      }
      setIsLoading(false);
    }
  }, [dispatch, cancelToken, customerId]);

  useEffect(() => {
    // Fetch data on mount
    if (customerId) {
      fetchInstitutionUsers();
    }
  }, [customerId, fetchInstitutionUsers]);

  return [users, isLoading, fetchInstitutionUsers];
};

export default useFetchUsersForInstitution;
