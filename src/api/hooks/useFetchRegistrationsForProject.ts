import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchResults, FetchResultsParams } from '../searchApi';

export const useFetchRegistrationsForProject = (projectId: string, rowsPerPage: number, page: number) => {
  const { t } = useTranslation();

  const registrationsQueryConfig: FetchResultsParams = {
    project: projectId,
    from: rowsPerPage * (page - 1),
    results: rowsPerPage,
  };

  return useQuery({
    queryKey: ['registrations', registrationsQueryConfig],
    queryFn: () => fetchResults(registrationsQueryConfig),
    meta: { errorMessage: t('feedback.error.search') },
  });
};
