import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getIdentifierFromId } from '../../utils/general-helpers';
import { fetchProject } from '../cristinApi';

interface FetchProjectOptions {
  keepPreviousData?: boolean;
}

export const useFetchProject = (projectId: string, options?: FetchProjectOptions) => {
  const { t } = useTranslation();

  const projectIdentifier = !isNaN(Number(projectId)) ? projectId : getIdentifierFromId(projectId);

  return useQuery({
    enabled: !!projectIdentifier,
    queryKey: ['project', projectIdentifier],
    queryFn: () => fetchProject(projectIdentifier),
    meta: { errorMessage: t('feedback.error.get_project') },
    placeholderData: options?.keepPreviousData ? keepPreviousData : undefined,
  });
};
