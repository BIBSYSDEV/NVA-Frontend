import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchCustomerResults, FetchCustomerResultsParams } from '../searchApi';

interface UseCustomerRegistrationSearch {
  enabled?: boolean;
  params: FetchCustomerResultsParams;
}

export const useCustomerRegistrationSearch = ({ enabled, params }: UseCustomerRegistrationSearch) => {
  const { t } = useTranslation();

  return useQuery({
    enabled,
    queryKey: ['customerRegistrations', params],
    queryFn: ({ signal }) => fetchCustomerResults(params, signal),
    meta: { errorMessage: t('feedback.error.search') },
  });
};
