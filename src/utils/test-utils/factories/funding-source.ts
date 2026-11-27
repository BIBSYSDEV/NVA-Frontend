import { FundingSources } from '../../../types/project.types';

/**
 * Builds the list of funding sources the app offers in its filters.
 *
 * @param overrides Fields to override on the default, which offers none.
 * @returns A list of funding sources.
 */
export const makeFundingSources = (overrides: Partial<FundingSources> = {}): FundingSources => ({
  id: '',
  sources: [],
  ...overrides,
});
