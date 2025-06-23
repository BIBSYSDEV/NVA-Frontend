import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchCustomers } from '../customerInstitutionsApi';

export const useFetchCustomers = () => {
  const { t } = useTranslation();

  return useQuery({
    queryKey: ['customers'],
    queryFn: ({ signal }) => fetchCustomers(signal),
    meta: { errorMessage: t('feedback.error.get_customers') },
  });
};
