import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { FetchProtectedResultsParams, fetchMyResults } from '../searchApi';

export const useMyRegistrationsSearch = (params: FetchProtectedResultsParams) => {
  const { t } = useTranslation();

  return useQuery({
    queryKey: ['myRegistrations', params],
    queryFn: ({ signal }) => fetchMyResults(params, signal),
    meta: { errorMessage: t('feedback.error.search') },
  });
};
