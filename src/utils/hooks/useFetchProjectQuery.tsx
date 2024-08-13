import { fetchProject } from '../../api/cristinApi';
import { useTranslation } from 'react-i18next';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export const useFetchProjectQuery = (projectId: string) => {
  const { t } = useTranslation();

  return useQuery({
    enabled: !!projectId,
    queryKey: ['project', projectId],
    queryFn: () => fetchProject(projectId),
    meta: { errorMessage: t('feedback.error.get_project') },
    placeholderData: keepPreviousData,
  });
};
