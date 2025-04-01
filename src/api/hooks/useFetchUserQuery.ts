import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchUser } from '../roleApi';

interface UseFetchUserOptions {
  retry?: number;
  staleTime?: number;
  gcTime?: number;
}

export const useFetchUserQuery = (username: string, options: UseFetchUserOptions = {}) => {
  const { t } = useTranslation();

  const usernameIdentifiers = username.split('@');
  const isValidPersonIdentifier =
    usernameIdentifiers.length === 2 && Number.isInteger(Number.parseInt(usernameIdentifiers[0]));

  return useQuery({
    enabled: isValidPersonIdentifier,
    queryKey: ['user', username],
    queryFn: () => fetchUser(username),
    meta: { errorMessage: t('feedback.error.get_person') },
    ...options,
  });
};
