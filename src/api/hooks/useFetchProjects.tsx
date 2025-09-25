import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { PersonSearchParams, searchForProjects } from '../cristinApi';

interface FetchProjectsOptions extends PersonSearchParams {
  searchTerm?: string;
  enabled?: boolean;
}

export const useFetchProjects = ({ searchTerm = '', enabled = true }: FetchProjectsOptions) => {
  const { t } = useTranslation();

  return useQuery({
    enabled: enabled,
    queryKey: ['projects', 10, 1, searchTerm],
    queryFn: () => searchForProjects(10, 1, { query: searchTerm }),
    meta: { errorMessage: t('feedback.error.project_search') },
  });
};
