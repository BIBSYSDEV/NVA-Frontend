import { useFetchUserQuery } from '../../api/hooks/useFetchUserQuery';
import { InstitutionUser } from '../../types/user.types';

interface UseInstitutionUserProps {
  existingUser?: InstitutionUser;
  username: string;
  enabled: boolean;
  showErrorMessage: boolean;
}

/**
 * Returns an InstitutionUser, either by returning the provided user, or by fetching it using the username if the provided user is undefined.
 * @param existingUser - InstitutionUser that might be undefined.
 * @param username - string used for user lookup.
 * @param enabled - Optionally prevent the lookup (default: true).
 * @param showErrorMessage - Show error message if an API fetch is done and fails.
 * @returns The InstitutionUser and the query object.
 */
export const useInstitutionUser = ({
  existingUser,
  username,
  enabled = true,
  showErrorMessage = true,
}: UseInstitutionUserProps) => {
  const institutionUserQuery = useFetchUserQuery(username, {
    enabled: enabled && !existingUser,
    showErrorMessage: showErrorMessage,
    retry: false,
  });

  return { institutionUser: existingUser ?? institutionUserQuery.data, institutionUserQuery };
};
