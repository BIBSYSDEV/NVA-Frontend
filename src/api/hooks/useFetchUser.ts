import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchUser } from '../roleApi';

export const useFetchUser = (username: string) => {
  const { t } = useTranslation();

  return useQuery({
    enabled: !!username,
    queryKey: ['user', username],
    queryFn: () => fetchUser(username),
    meta: { errorMessage: t('feedback.error.get_person') },
  });
};
