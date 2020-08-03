import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Axios from 'axios';

import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { UserAdmin } from '../../types/user.types';
import { getUsersForInstitution } from '../../api/roleApi';

const useFetchUsersForInstitution = (institution: string): [UserAdmin[] | undefined, boolean] => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState<UserAdmin[] | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const cancelSource = Axios.CancelToken.source();
    const fetchAuthorities = async () => {
      setIsLoading(true);
      const fetchedAuthorities = await getUsersForInstitution(institution, cancelSource.token);
      if (fetchedAuthorities) {
        setIsLoading(false);
        if (fetchedAuthorities.error) {
          dispatch(setNotification(fetchedAuthorities.error, NotificationVariant.Error));
        } else {
          setUsers(fetchedAuthorities);
        }
      }
    };
    if (institution) {
      fetchAuthorities();
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
