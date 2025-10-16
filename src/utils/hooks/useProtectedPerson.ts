import { useFetchProtectedPerson } from '../../api/hooks/useFetchProtectedPerson';
import { CristinPerson } from '../../types/user.types';

/**
 * React hook that retrieves protected person data based on a CristinPerson object or person ID.
 * Uses `useFetchProtectedPerson` to fetch data unless an existing person object is provided.
 * @param existingPerson - CristinPerson object or person ID string.
 * @param searchEnabled - Optional flag to enable or disable fetching (default: true).
 * @returns An object containing the resolved person data and the query result.
 */
export const useProtectedPerson = (existingPerson: CristinPerson | string, searchEnabled = true) => {
  const personId = typeof existingPerson === 'string' ? existingPerson : existingPerson.id;
  const existingPersonObject = typeof existingPerson === 'object' ? existingPerson : undefined;
  const personQuery = useFetchProtectedPerson(personId, { enabled: searchEnabled && !existingPersonObject });
  const resolvedPerson = existingPersonObject ?? personQuery.data;

  return { person: resolvedPerson, personQuery };
};
