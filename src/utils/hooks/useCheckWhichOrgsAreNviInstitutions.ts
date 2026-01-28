import { useFetchCustomerMap } from '../../api/hooks/useFetchCustomerMap';
import { useFetchTopLevelOrganizations } from '../../api/hooks/useFetchTopLevelOrganizations';

export interface NviStatusObject {
  isNviInstitution: boolean | undefined;
  isLoading: boolean;
}

/* Given a list of orgIds we check all to see if they are, or are descendant of, an NVI institution */
export const useCheckWhichOrgsAreNviInstitutions = (orgIds: string[]) => {
  const uniqueOrgIds = Array.from(new Set(orgIds));
  const { nvaCustomers, isFetchingCustomerMap } = useFetchCustomerMap();

  const nviStatusForOrgs = new Map<string, NviStatusObject>(
    uniqueOrgIds.map((id) => {
      return [
        id,
        {
          isNviInstitution: !isFetchingCustomerMap ? nvaCustomers.get(id)?.nviInstitution : undefined,
          isLoading: isFetchingCustomerMap,
        },
      ];
    })
  );

  // When customerMap is still fetching this will add all orgIds since they are not yet found in the (empty) map
  const orgIdsNotInCustomersMaps: string[] = Array.from(nviStatusForOrgs.entries())
    .filter(([, value]) => value.isNviInstitution === undefined)
    .map(([id]) => id);

  // When customerMap is still fetching this will be an empty response
  const topLevelOrganizations = useFetchTopLevelOrganizations(
    isFetchingCustomerMap ? [] : orgIdsNotInCustomersMaps,
    !isFetchingCustomerMap
  );

  topLevelOrganizations.forEach((orgResult) => {
    if (!orgResult.isLoading) {
      const customer = orgResult.organization?.id ? nvaCustomers.get(orgResult.organization.id) : undefined;
      if (customer) {
        nviStatusForOrgs.set(orgResult.id, { isNviInstitution: customer.nviInstitution, isLoading: false });
      } else {
        nviStatusForOrgs.set(orgResult.id, { isNviInstitution: undefined, isLoading: false });
      }
    } else {
      nviStatusForOrgs.set(orgResult.id, { isNviInstitution: undefined, isLoading: true });
    }
  });
  return nviStatusForOrgs;
};
