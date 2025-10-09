import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { CristinPerson } from '../../types/user.types';
import { UseFetchPersonOptions } from './useFetchCristinPerson';
import { fetchProtectedResource } from '../commonApi';

export const useFetchProtectedPerson = (personId: string, options?: UseFetchPersonOptions) => {
  const { t } = useTranslation();

  return useQuery({
    enabled: options?.enabled !== false && !!personId,
    queryKey: ['protectedPerson', personId],
    queryFn: () => fetchProtectedResource<CristinPerson>(personId),
    meta: { errorMessage: t('feedback.error.get_person') },
    staleTime: options?.staleTime,
    gcTime: options?.gcTime,
  });
};
