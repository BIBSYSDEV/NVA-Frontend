import { CustomerInstitution, DoiAgent, emptyCustomerInstitution } from '../../types/customerInstitution.types';

export const makeDoiAgent = (overrides: Partial<DoiAgent> = {}): DoiAgent => ({
  id: '',
  prefix: '',
  username: '',
  ...overrides,
});

/**
 * Builds a valid customer institution from the app's own empty customer institution, which omits the DOI agent.
 *
 * @param overrides Fields to override on the empty customer institution.
 * @returns A customer institution that is safe to mutate.
 */
export const makeCustomerInstitution = (overrides: Partial<CustomerInstitution> = {}): CustomerInstitution => ({
  ...structuredClone(emptyCustomerInstitution),
  doiAgent: makeDoiAgent(),
  ...overrides,
});
