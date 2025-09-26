import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { searchForProjects } from '../cristinApi';

interface FetchProjectsOptions {
  searchTerm?: string;
  enabled?: boolean;
  results?: number;
  page?: number;
}

export const useFetchProjects = ({ searchTerm = '', enabled = true, results = 10, page = 1 }: FetchProjectsOptions) => {
  const { t } = useTranslation();

  return useQuery({
    enabled,
    queryKey: ['projects', results, page, searchTerm],
    queryFn: () => searchForProjects(results, page, { query: searchTerm }),
    meta: { errorMessage: t('feedback.error.project_search') },
  });
};
