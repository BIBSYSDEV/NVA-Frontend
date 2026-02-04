import { getTopLevelOrganization } from '../../utils/institutions-helpers';
import { useFetchMultipleOrganizations } from './useFetchMultipleOrganizations';

/* Given a list of IDs, this hook returns a list of objects that contains for each of the ids either the organization
the id represents if is the top level organization of its branch, or the top level organization  */
export const useFetchTopLevelOrganizations = (orgIds: string[], enabled = true) => {
  const organizationsQuery = useFetchMultipleOrganizations(orgIds, enabled);
  return organizationsQuery.map((q, idx) => ({
    id: orgIds[idx],
    organization: q.data ? getTopLevelOrganization(q.data) : undefined,
    isLoading: q.isLoading,
  }));
};
