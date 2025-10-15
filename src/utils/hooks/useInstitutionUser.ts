import { useFetchUserQuery } from '../../api/hooks/useFetchUserQuery';
import { InstitutionUser } from '../../types/user.types';

/**
 * Returns an InstitutionUser, either by returning the provided user, or by fetching it using the username if the provided user is undefined.
 * @param existingUser - InstitutionUser that might be undefined.
 * @param username - string used for user lookup.
 * @param searchEnabled - Optionally prevent the lookup (default: true).
 * @returns The InstitutionUser and the query object.
 */
export const useInstitutionUser = (existingUser?: InstitutionUser, username: string, searchEnabled = true) => {
  const institutionUserQuery = useFetchUserQuery(username, {
    enabled: searchEnabled && !existingUser,
    showErrorMessage: false, // No error message, since a Cristin Person will lack User if they have not logged in yet
    retry: false,
  });

  return { institutionUser: existingUser ?? institutionUserQuery.data, institutionUserQuery };
};
