import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchCustomerResults, FetchCustomerResultsParams } from '../searchApi';

export const useCustomerRegistrationSearch = (params: FetchCustomerResultsParams) => {
  const { t } = useTranslation();

  return useQuery({
    queryKey: ['customerRegistrations', params],
    queryFn: ({ signal }) => fetchCustomerResults(params, signal),
    meta: { errorMessage: t('feedback.error.search') },
  });
};
