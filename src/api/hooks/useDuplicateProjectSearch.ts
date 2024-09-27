import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ProjectsSearchParams, searchForProjects } from '../cristinApi';

interface UseDuplicateProjectSearchProps {
  title?: string;
  id?: string;
}

export const useDuplicateProjectSearch = ({ title, id }: UseDuplicateProjectSearchProps) => {
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

  const duplicateProject = !title
    ? undefined
    : projectsWithSimilarName.find((project) => {
        const isSameProject = project.id === id;
        const hasSameName = project.title.toLowerCase() === title.toLowerCase();

        if (!hasSameName || isSameProject) {
          return false;
        }

        return true;
      });

  return {
    isPending: enabled && projectQuery.isPending,
    duplicateProject: duplicateProject,
  };
};
