import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchUser } from '../roleApi';
import { InstitutionUser } from '../../types/user.types';
import { checkIfValidPersonIdentifier } from '../../utils/user-helpers';

interface UseFetchUserOptions {
  enabled?: boolean;
  errorMessage?: boolean;
  retry?: number | boolean;
  staleTime?: number;
  gcTime?: number;
  initialData?: InstitutionUser | undefined;
}

export const useFetchInstitutionUser = (
  username: string,
  { enabled, errorMessage, ...options }: UseFetchUserOptions = {}
) => {
  const { t } = useTranslation();
  const isValidPersonIdentifier = checkIfValidPersonIdentifier(username);

  return useQuery({
    enabled: enabled && isValidPersonIdentifier,
    queryKey: ['institutionUser', username],
    queryFn: () => fetchUser(username),
    meta: { errorMessage: errorMessage === true && t('feedback.error.get_person') },
    ...options,
  });
};
