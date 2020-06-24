import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Axios from 'axios';

import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { FormikPublication } from '../../types/publication.types';
import { getPublication } from '../../api/publicationApi';
import { RootStore } from '../../redux/reducers/rootReducer';

const useFetchPublication = (
  identifier: string | undefined
): [FormikPublication | undefined, boolean, (values: FormikPublication) => void] => {
  const dispatch = useDispatch();
  const [publication, setPublication] = useState<FormikPublication>();
  const [isLoading, setIsLoading] = useState(!!identifier);
  const user = useSelector((store: RootStore) => store.user);

  const handleSetPublication = (values: FormikPublication) => {
    setPublication(values);
  };

  useEffect(() => {
    const cancelSource = Axios.CancelToken.source();

    const fetchPublication = async () => {
      const publication = await getPublication(identifier!, cancelSource.token);
      if (publication) {
        if (publication.error) {
          dispatch(setNotification(publication.error, NotificationVariant.Error));
        } else {
          setPublication(publication);
        }
        setIsLoading(false);
      }
    };
    if (identifier) {
      fetchPublication();
    }

    return () => {
      if (identifier) {
        cancelSource.cancel();
      }
    };
  }, [dispatch, identifier, user]);

  return [publication, isLoading, handleSetPublication];
};

export default useFetchPublication;
