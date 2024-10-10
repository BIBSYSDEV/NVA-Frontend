import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { searchForProjects } from '../cristinApi';

export const useFetchProjects = (searchTerm: string) => {
  const { t } = useTranslation();

  return useQuery({
    enabled: searchTerm.length > 0,
    queryKey: ['projects', 10, 1, searchTerm],
    queryFn: () => searchForProjects(10, 1, { query: searchTerm }),
    meta: { errorMessage: t('feedback.error.project_search') },
  });
};
