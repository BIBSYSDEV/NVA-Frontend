import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchUserResults, FetchUserResultsParams } from '../searchApi';

export const useUserRegistrationSearch = (params: FetchUserResultsParams) => {
  const { t } = useTranslation();

  return useQuery({
    queryKey: ['userRegistrations', params],
    queryFn: ({ signal }) => fetchUserResults(params, signal),
    meta: { errorMessage: t('feedback.error.search') },
  });
};
