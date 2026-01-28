import { getTopLevelOrganization } from '../../utils/institutions-helpers';
import { useFetchMultipleOrganizations } from './useFetchMultipleOrganizations';

export const useFetchTopLevelOrganizations = (orgIds: string[], enabled = true) => {
  const organizationsQuery = useFetchMultipleOrganizations(orgIds, enabled);
  return organizationsQuery.map((q, idx) => ({
    id: orgIds[idx],
    organization: q.data ? getTopLevelOrganization(q.data) : undefined,
    isLoading: q.isLoading,
    isError: q.isError,
  }));
};
