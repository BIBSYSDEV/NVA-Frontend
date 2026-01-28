import { useFetchCustomerMap } from '../../api/hooks/useFetchCustomerMap';
import { useFetchTopLevelOrganizations } from '../../api/hooks/useFetchTopLevelOrganizations';

/* Given a list of orgIds we check all to see if they are, or are descendant of, an NVI institution */
export const useCheckNviStatusForOrgs = (orgIds: string[]) => {
  const uniqueOrgIds = Array.from(new Set(orgIds));
  const nvaCustomers = useFetchCustomerMap();
  const nviStatusForOrgs = new Map(
    uniqueOrgIds.map((id) => {
      const customer = nvaCustomers.get(id);
      if (customer) {
        return [id, customer.nviInstitution];
      }
      return [id, undefined];
    })
  );

  const orgIdsNotInCustomersMaps = Array.from(nviStatusForOrgs.entries())
    .filter(([, value]) => value === undefined)
    .map(([id]) => id);

  const topLevelOrganizations = useFetchTopLevelOrganizations(orgIdsNotInCustomersMaps);

  topLevelOrganizations.forEach((orgResult) => {
    const customer = orgResult.organization?.id ? nvaCustomers.get(orgResult.organization.id) : undefined;
    if (customer) {
      nviStatusForOrgs.set(orgResult.id, !!customer.nviInstitution);
    }
  });
  return nviStatusForOrgs;
};
