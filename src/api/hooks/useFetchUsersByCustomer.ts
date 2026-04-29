import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { RoleName } from '../../types/user.types';
import { fetchUsersByCustomer } from '../roleApi';

export const useFetchUsersByCustomer = (customerId?: string, role?: RoleName | RoleName[]) => {
  const { t } = useTranslation();

  return useQuery({
    queryKey: ['institutionUsers', customerId, role],
    enabled: !!customerId,
    queryFn: () => (customerId ? fetchUsersByCustomer(customerId, role) : null),
    meta: { errorMessage: t('feedback.error.get_users_for_institution') },
  });
};
