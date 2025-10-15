import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { CristinPerson } from '../../types/user.types';
import { fetchProtectedResource } from '../commonApi';

interface ProtectedPersonOptions {
  enabled?: boolean;
}

export const useFetchProtectedPerson = (personId: string, { enabled = true }: ProtectedPersonOptions = {}) => {
  const { t } = useTranslation();

  return useQuery({
    enabled: enabled && !!personId,
    queryKey: ['protectedPerson', personId],
    queryFn: () => fetchProtectedResource<CristinPerson>(personId),
    meta: { errorMessage: t('feedback.error.get_person') },
  });
};
