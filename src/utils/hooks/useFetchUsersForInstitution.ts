import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Axios from 'axios';

import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { UserAdmin } from '../../types/user.types';
import { getUsersForInstitution } from '../../api/roleApi';

const useFetchUsersForInstitution = (institution: string): [UserAdmin[] | [], boolean] => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState<UserAdmin[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const cancelSource = Axios.CancelToken.source();
    const fetchUsers = async () => {
      setIsLoading(true);
      const fetchedUsers = await getUsersForInstitution(institution, cancelSource.token);
      if (fetchedUsers) {
        setIsLoading(false);
        if (fetchedUsers.error) {
          dispatch(setNotification(fetchedUsers.error, NotificationVariant.Error));
        } else {
          setUsers(fetchedUsers);
        }
      }
    };
    if (institution) {
      fetchUsers();
    }

    return () => {
      if (institution) {
        cancelSource.cancel();
      }
    };
  }, [dispatch, institution]);

  return [users, isLoading];
};

export default useFetchUsersForInstitution;
