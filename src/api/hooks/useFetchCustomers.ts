import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { CustomerList } from '../../types/customerInstitution.types';
import { fetchCustomers } from '../customerInstitutionsApi';

export const useFetchCustomers = (config?: Partial<UseQueryOptions<CustomerList>>) => {
  const { t } = useTranslation();

  return useQuery({
    queryKey: ['customers'],
    queryFn: ({ signal }) => fetchCustomers(signal),
    meta: { errorMessage: t('feedback.error.get_customers') },
    ...config,
  });
};
