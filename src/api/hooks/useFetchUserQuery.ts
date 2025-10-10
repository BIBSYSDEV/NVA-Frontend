import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchUser } from '../roleApi';

interface UseFetchUserOptions {
  enabled?: boolean;
  showErrorMessage?: boolean;
  retry?: number | boolean;
  staleTime?: number;
  gcTime?: number;
}

export const useFetchUserQuery = (
  username: string,
  { enabled = true, showErrorMessage = true, ...options }: UseFetchUserOptions = {}
) => {
  const { t } = useTranslation();

  const usernameIdentifiers = username.split('@');
  const isValidPersonIdentifier =
    usernameIdentifiers.length === 2 && Number.isInteger(Number.parseInt(usernameIdentifiers[0]));

  return useQuery({
    enabled: enabled && isValidPersonIdentifier,
    queryKey: ['user', username],
    queryFn: () => fetchUser(username),
    meta: { errorMessage: showErrorMessage === true && t('feedback.error.get_person') },
    ...options,
  });
};
