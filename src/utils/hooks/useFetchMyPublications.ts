import { useEffect, useState } from 'react';
import Axios from 'axios';
import { getMyPublications } from '../../api/publicationApi';
import { useDispatch } from 'react-redux';
import { PublicationPreview } from '../../types/publication.types';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';

const useFetchMyPublications = (): [PublicationPreview[] | [], boolean] => {
  const dispatch = useDispatch();

  const [publications, setPublications] = useState<PublicationPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const cancelSource = Axios.CancelToken.source();

    const fetchMyPublications = async () => {
      const myPublications = await getMyPublications(cancelSource.token);
      if (myPublications) {
        setIsLoading(false);
        if (myPublications.error) {
          dispatch(setNotification(myPublications.error, NotificationVariant.Error));
        } else {
          setPublications(myPublications);
        }
      }
    };
    fetchMyPublications();
  }, [dispatch]);
  return [publications, isLoading];
};

export default useFetchMyPublications;
