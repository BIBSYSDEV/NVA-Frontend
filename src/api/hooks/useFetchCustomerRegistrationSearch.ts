import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { FetchResultsParams, fetchResults } from '../searchApi';

interface UseCustomerRegistrationSearch {
  enabled?: boolean;
  params: FetchResultsParams;
}

export const useCustomerRegistrationSearch = ({ enabled, params }: UseCustomerRegistrationSearch) => {
  const { t } = useTranslation();

  return useQuery({
    enabled,
    queryKey: ['customerRegistrations', params],
    queryFn: ({ signal }) => fetchResults(params, signal), // TODO: Use new customer endpoint
    meta: { errorMessage: t('feedback.error.search') },
  });
};
