import { useFetchCustomerMap } from '../../api/hooks/useFetchCustomerMap';
import { useFetchTopLevelOrganizations } from '../../api/hooks/useFetchTopLevelOrganizations';

export interface NviStatusObject {
  isNviInstitution: boolean | undefined;
  isLoading: boolean;
}

/* Given a list of orgIds we check all to see if they are, or are descendant of, an NVI institution */
export const useCheckNviStatusForOrgs = (orgIds: string[]) => {
  const uniqueOrgIds = Array.from(new Set(orgIds));
  const { nvaCustomers, isFetchingCustomerMap } = useFetchCustomerMap();
  let nviStatusForOrgs = new Map<string, NviStatusObject | undefined>();
  let orgIdsNotInCustomersMaps: string[] = [];

  // Not performing any more logic until we have the customer map
  if (!isFetchingCustomerMap) {
    nviStatusForOrgs = new Map<string, NviStatusObject | undefined>(
      uniqueOrgIds.map((id) => {
        const customer = nvaCustomers.get(id);
        if (customer) {
          return [id, { isNviInstitution: customer.nviInstitution, isLoading: false }];
        }
        return [id, undefined];
      })
    );

    orgIdsNotInCustomersMaps = Array.from(nviStatusForOrgs.entries())
      .filter(([, value]) => value === undefined)
      .map(([id]) => id);
  }
  const topLevelOrganizations = useFetchTopLevelOrganizations(orgIdsNotInCustomersMaps, !isFetchingCustomerMap);

  if (isFetchingCustomerMap) {
    return new Map<string, NviStatusObject | undefined>(uniqueOrgIds.map((id) => [id, undefined]));
  }

  topLevelOrganizations.forEach((orgResult) => {
    if (!orgResult.isLoading) {
      const customer = orgResult.organization?.id ? nvaCustomers.get(orgResult.organization.id) : undefined;
      if (customer) {
        nviStatusForOrgs.set(orgResult.id, { isNviInstitution: !!customer.nviInstitution, isLoading: false });
      } else {
        nviStatusForOrgs.set(orgResult.id, { isNviInstitution: undefined, isLoading: false });
      }
    } else {
      nviStatusForOrgs.set(orgResult.id, { isNviInstitution: undefined, isLoading: true });
    }
  });
  return nviStatusForOrgs;
};
