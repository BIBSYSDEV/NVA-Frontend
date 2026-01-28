import { getTopLevelOrganization } from '../../utils/institutions-helpers';
import { useFetchMultipleOrganizations } from './useFetchMultipleOrganizations';

export const useFetchTopLevelOrganizations = (orgIds: string[]) => {
  const organizationsQuery = useFetchMultipleOrganizations(orgIds);
  return organizationsQuery.map((q, idx) => ({
    id: orgIds[idx],
    organization: q.data ? getTopLevelOrganization(q.data) : undefined,
  }));
};
