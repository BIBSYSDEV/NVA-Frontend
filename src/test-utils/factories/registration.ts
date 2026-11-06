import { emptyRegistration, Registration } from '../../types/registration.types';

/**
 * Builds a valid registration empty registration base values.
 *
 * @param overrides Fields to override on the empty registration.
 * @returns A registration that is safe to mutate.
 */
export const makeRegistration = (overrides: Partial<Registration> = {}): Registration => ({
  ...structuredClone(emptyRegistration),
  ...overrides,
});
