import { Organization } from '../../../types/organization.types';

export const makeOrganization = (overrides: Partial<Organization> = {}): Organization => ({
  type: 'Organization',
  id: '',
  labels: {},
  ...overrides,
});
