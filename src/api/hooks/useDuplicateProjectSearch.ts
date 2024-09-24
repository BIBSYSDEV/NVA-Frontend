import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ProjectsSearchParams, searchForProjects } from '../cristinApi';

export const useDuplicateProjectSearch = (title: string | undefined) => {
  const { t } = useTranslation();

  const projectQueryParams: ProjectsSearchParams = {
    query: title,
  };

  const enabled = !!title;

  const projectQuery = useQuery({
    enabled: enabled,
    queryKey: ['projects', projectQueryParams],
    queryFn: () => searchForProjects(10, 1, projectQueryParams),
    meta: { errorMessage: t('feedback.error.project_search') },
  });

  const projectsWithSimilarName = projectQuery.data?.hits ?? [];

  const duplicateProject = projectsWithSimilarName.find((project) => {
    if (!title) {
      return false;
    }

    return project.title?.toLowerCase() === title.toLowerCase();
  });

  return {
    isPending: enabled && projectQuery.isPending,
    duplicateProject: duplicateProject,
  };
};
