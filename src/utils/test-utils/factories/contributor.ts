/**
 * Factories for contributor entities. Each factory returns the smallest valid object with typed defaults, so a test
 * only has to state the fields it actually asserts on.
 */
import { Contributor, emptyContributor, Identity } from '../../../types/contributor.types';

export const makeIdentity = (overrides: Partial<Identity> = {}): Identity => ({
  ...structuredClone(emptyContributor.identity),
  ...overrides,
});

export const makeContributor = (overrides: Partial<Contributor> = {}): Contributor => ({
  ...structuredClone(emptyContributor),
  sequence: 1,
  ...overrides,
});
