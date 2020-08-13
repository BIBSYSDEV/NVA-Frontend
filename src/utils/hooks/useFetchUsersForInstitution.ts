import { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import Axios from 'axios';

import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { InstitutionUser } from '../../types/user.types';
import { getUsersForInstitution } from '../../api/roleApi';

const useFetchUsersForInstitution = (institution: string): [InstitutionUser[], boolean, () => void] => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState<InstitutionUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const cancelSourceRef = useRef(Axios.CancelToken.source());

  const fetchInstitutionUsers = useCallback(async () => {
    setIsLoading(true);
    const fetchedUsers = await getUsersForInstitution(institution, cancelSourceRef.current.token);
    if (fetchedUsers) {
      if (fetchedUsers.error) {
        dispatch(setNotification(fetchedUsers.error, NotificationVariant.Error));
      } else {
        setUsers(fetchedUsers);
      }
    }
    setIsLoading(false);
  }, [dispatch, institution]);

  useEffect(() => {
    // Fetch data on mount
    if (institution) {
      fetchInstitutionUsers();
    }
  }, [institution, fetchInstitutionUsers]);

  useEffect(() => {
    // Cancel request on unmount
    const cancelSource = cancelSourceRef.current;
    return () => cancelSource.cancel();
  }, []);

  return [users, isLoading, fetchInstitutionUsers];
};

export default useFetchUsersForInstitution;
