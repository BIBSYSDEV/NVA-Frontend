import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ProjectsSearchParams, searchForProjects } from '../cristinApi';

interface FetchProjectsOptions extends ProjectsSearchParams {
  searchTerm?: string;
  enabled?: boolean;
  results?: number;
  page?: number;
}

export const useFetchProjects = ({ searchTerm = '', enabled = true, results = 10, page = 1 }: FetchProjectsOptions) => {
  const { t } = useTranslation();

  return useQuery({
    enabled: enabled,
    queryKey: ['projects', results, page, searchTerm],
    queryFn: () => searchForProjects(results, page, { query: searchTerm }),
    meta: { errorMessage: t('feedback.error.project_search') },
  });
};
