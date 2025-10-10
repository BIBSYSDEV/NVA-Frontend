import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchUser } from '../roleApi';

interface UseFetchUserOptions {
  retry?: number | boolean;
  staleTime?: number;
  gcTime?: number;
  enabled?: boolean;
  errorMessage?: boolean;
}

export const useFetchUserQuery = (
  username: string,
  { enabled, errorMessage, ...options }: UseFetchUserOptions = {}
) => {
  const { t } = useTranslation();
  const [cristinPersonIdentifier, topOrgCristinIdentifier] = username.split('@');
  const isValidPersonIdentifier =
    !!cristinPersonIdentifier &&
    !!topOrgCristinIdentifier &&
    Number.isInteger(Number.parseInt(cristinPersonIdentifier));

  return useQuery({
    enabled: enabled && isValidPersonIdentifier,
    queryKey: ['user', username],
    queryFn: () => fetchUser(username),
    meta: { errorMessage: errorMessage === true && t('feedback.error.get_person') },
    ...options,
  });
};
