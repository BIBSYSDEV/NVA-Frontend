import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchUserResults, FetchUserResultsParams } from '../searchApi';

export const useMyRegistrationsSearch = (params: FetchUserResultsParams) => {
  const { t } = useTranslation();

  return useQuery({
    queryKey: ['myRegistrations', params],
    queryFn: ({ signal }) => fetchUserResults(params, signal),
    meta: { errorMessage: t('feedback.error.search') },
  });
};
