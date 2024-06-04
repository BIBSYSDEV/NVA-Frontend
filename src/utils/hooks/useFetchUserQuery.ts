import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchUser } from '../../api/roleApi';

export const useFetchUserQuery = (username: string) => {
  const { t } = useTranslation();

  return useQuery({
    enabled: !!username,
    queryKey: ['user', username],
    queryFn: () => fetchUser(username),
    meta: { errorMessage: t('feedback.error.get_person') },
    retry: 0,
    staleTime: Infinity,
    gcTime: 1_800_000, // 30 minutes
  });
};
