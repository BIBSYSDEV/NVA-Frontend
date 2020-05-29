import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Axios from 'axios';

import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { PublicationStatus, emptyPublication, FormikPublication } from '../../types/publication.types';
import { getPublication } from '../../api/publicationApi';
import { useHistory } from 'react-router-dom';
import { RootStore } from '../../redux/reducers/rootReducer';
import deepmerge from 'deepmerge';

const useFetchPublication = (
  identifier: string | undefined,
  editMode: boolean = false,
  closeForm?: () => void
): [FormikPublication, boolean, (values: FormikPublication) => void] => {
  const dispatch = useDispatch();
  const [publication, setPublication] = useState<FormikPublication>(emptyPublication);
  const [isLoading, setIsLoading] = useState(!!identifier);
  const history = useHistory();
  const user = useSelector((store: RootStore) => store.user);

  const handleSetPublication = (values: FormikPublication) => {
    setPublication(values);
  };

  useEffect(() => {
    const cancelSource = Axios.CancelToken.source();

    const fetchPublication = async () => {
      const publication = await getPublication(identifier!, cancelSource.token);
      if (publication) {
        setIsLoading(false);
        if (publication.error) {
          dispatch(setNotification(publication.error, NotificationVariant.Error));
          closeForm?.();
        } else if (editMode) {
          if (publication.status === PublicationStatus.PUBLISHED && !user.isCurator) {
            history.push(`/publication/${identifier}/public`);
          } else {
            setPublication(deepmerge(emptyPublication, publication));
          }
        } else {
          setPublication(publication);
        }
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
  }, [dispatch, identifier, closeForm, editMode, history, user.isCurator]);

  return [publication, isLoading, handleSetPublication];
};

export default useFetchPublication;
