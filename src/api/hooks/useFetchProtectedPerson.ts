import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { CristinPerson } from '../../types/user.types';
import { fetchProtectedResource } from '../commonApi';

interface ProtectedPersonOptions {
  enabled?: boolean;
}

export const useFetchProtectedPerson = (personId: string, { enabled }: ProtectedPersonOptions = {}) => {
  const { t } = useTranslation();

  return useQuery({
    enabled: enabled === true && !!personId,
    queryKey: [personId],
    queryFn: () => fetchProtectedResource<CristinPerson>(personId),
    meta: { errorMessage: t('feedback.error.get_person') },
  });
};
