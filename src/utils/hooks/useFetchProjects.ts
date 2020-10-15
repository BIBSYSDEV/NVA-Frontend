import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Axios from 'axios';

import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { CristinProject } from '../../types/project.types';
import { searchProjectsByTitle } from '../../api/projectApi';

const useFetchProjects = (
  initialSearchTerm: string
): [CristinProject[], boolean, (searchTerm: string) => void, string | undefined] => {
  const dispatch = useDispatch();
  const [projects, setProjects] = useState<CristinProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  const handleNewSearchTerm = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  useEffect(() => {
    const cancelSource = Axios.CancelToken.source();
    const fetchProjects = async () => {
      setIsLoading(true);
      const fetchedProjects = await searchProjectsByTitle(searchTerm, cancelSource.token);
      if (fetchedProjects) {
        setIsLoading(false);
        if (fetchedProjects.error) {
          dispatch(setNotification(fetchedProjects.error, NotificationVariant.Error));
        } else {
          setProjects(fetchedProjects);
        }
      }
    };
    if (searchTerm) {
      fetchProjects();
    } else {
      setProjects([]);
    }

    return () => {
      if (searchTerm) {
        cancelSource.cancel();
      }
    };
  }, [dispatch, searchTerm]);

  return [projects, isLoading, handleNewSearchTerm, searchTerm];
};

export default useFetchProjects;
