import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchProject } from '../cristinApi';

export const useFetchProject = (projectId: string) => {
  const { t } = useTranslation();

  return useQuery({
    enabled: !!projectId,
    queryKey: ['project', projectId],
    queryFn: () => fetchProject(projectId),
    meta: { errorMessage: t('feedback.error.get_project') },
  });
};
