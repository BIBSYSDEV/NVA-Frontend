import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchUser } from '../roleApi';

interface UseFetchUserQueryProps {
  retry?: number;
  staleTime?: number;
  gcTime?: number;
}

export const useFetchUserQuery = (username: string, queryProps: UseFetchUserQueryProps = {}) => {
  const { t } = useTranslation();

  const isValidUsernameFormat = !!username && username.includes('@') && Number.isInteger(username.split('@')[0]);

  return useQuery({
    enabled: !!isValidUsernameFormat,
    queryKey: ['user', username],
    queryFn: () => fetchUser(username),
    meta: { errorMessage: t('feedback.error.get_person') },
    ...queryProps,
  });
};
