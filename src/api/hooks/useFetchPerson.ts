import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchPerson } from '../cristinApi';

interface UseFetchPersonProps {
  enabled?: boolean;
}

export const useFetchPerson = (cristinId: string, { enabled }: UseFetchPersonProps) => {
  const { t } = useTranslation();

  return useQuery({
    enabled,
    queryKey: ['person', cristinId],
    queryFn: () => fetchPerson(cristinId),
    meta: { errorMessage: t('feedback.error.get_person') },
  });
};
