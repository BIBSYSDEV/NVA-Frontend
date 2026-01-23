import { useFetchCustomers } from '../api/hooks/useFetchCustomers';
import { useFetchMultipleOrganizations } from '../api/hooks/useFetchMultipleOrganizations';
import { Affiliation } from '../types/contributor.types';
import { ClaimedChannel, SimpleCustomerInstitution } from '../types/customerInstitution.types';
import { getTopLevelOrganization } from './institutions-helpers';

export const filterChannelClaims = (channelClaimList: ClaimedChannel[], customerId: string): ClaimedChannel[] => {
  return channelClaimList.filter((claim) => claim.claimedBy.id === customerId);
};

export const someAffiliationIsNviCustomer = (
  affiliations: Affiliation[] | undefined,
  customerMap: Map<string, SimpleCustomerInstitution>
) =>
  affiliations
    ? affiliations.some(
        (affiliation) =>
          'id' in affiliation && !!customerMap.get(getTopLevelOrganization(affiliation).id)?.nviInstitution
      )
    : false;

export const useCustomerCristinIdMap = () => {
  const customersQuery = useFetchCustomers();
  const customers = customersQuery.data?.customers ?? [];
  return new Map(customers.map((customer) => [customer.cristinId, customer]));
};

export const useAffiliationNviCheck = (affiliations: Affiliation[] | undefined) => {
  const affiliationIds = affiliations
    ? affiliations.filter((affiliation) => 'id' in affiliation && affiliation.id).map((affiliation) => affiliation.id)
    : [];
  const organizationsQuery = useFetchMultipleOrganizations(affiliationIds);
  const organizations = organizationsQuery.map((q) => q.data);
  console.log('organizations', organizations);
};
