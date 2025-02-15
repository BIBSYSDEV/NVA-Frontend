import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getIdentifierFromId } from '../../utils/general-helpers';
import { fetchProject } from '../cristinApi';

export const useFetchProject = (projectId: string) => {
  const { t } = useTranslation();

  const projectIdentifier = isNaN(Number(projectId)) ? getIdentifierFromId(projectId) : projectId;

  return useQuery({
    enabled: !!projectIdentifier,
    queryKey: ['project', projectIdentifier],
    queryFn: () => fetchProject(projectIdentifier),
    meta: { errorMessage: t('feedback.error.get_project') },
  });
};
