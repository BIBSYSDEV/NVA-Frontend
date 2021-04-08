import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import useCancelToken from './useCancelToken';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { CristinProject } from '../../types/project.types';
import { searchProjectsByTitle } from '../../api/projectApi';

export const useFetchProjects = (searchTerm = ''): [CristinProject[], boolean] => {
  const dispatch = useDispatch();
  const { t } = useTranslation('feedback');
  const [projects, setProjects] = useState<CristinProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const cancelToken = useCancelToken();

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      const fetchedProjects = await searchProjectsByTitle(searchTerm, cancelToken);
      if (fetchedProjects) {
        setIsLoading(false);
        if (fetchedProjects.error) {
          dispatch(setNotification(t('error.get_project'), NotificationVariant.Error));
        } else if (fetchedProjects.data) {
          setProjects(fetchedProjects.data.hits ?? []);
        }
      }
    };
    if (searchTerm) {
      fetchProjects();
    } else {
      setProjects([]);
    }
  }, [dispatch, t, cancelToken, searchTerm]);

  return [projects, isLoading];
};
