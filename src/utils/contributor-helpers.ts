import { Contributor, ContributorRole, Identity } from '../types/contributor.types';

export interface ContributorEntry {
  contributor: Contributor;
  /** Index of the contributor in the original contributors array, to be used in Formik field names. */
  index: number;
}

/**
 * Key used to decide which contributors describe the same person. A person with several roles is
 * stored as one contributor per role, all sharing the same identity.
 *
 * Only verified contributors can be recognized as the same person, through their Cristin ID.
 * Unverified contributors have no ID, and are never treated as the same person even if they have the
 * same name: they get an empty key, and are kept apart.
 */
export const getIdentityKey = ({ id }: Pick<Identity, 'id'>): string => id ?? '';

/**
 * The roles the same person already has on their other contributors. A contributor cannot change to
 * one of these, since a person can only have each role once.
 */
export const getRolesOnOtherContributors = (contributors: Contributor[], index: number): ContributorRole[] => {
  const identityKey = getIdentityKey(contributors[index]?.identity ?? {});

  if (!identityKey) {
    return [];
  }

  return contributors
    .filter((contributor, thisIndex) => thisIndex !== index && getIdentityKey(contributor.identity) === identityKey)
    .map((contributor) => contributor.role?.type)
    .filter((role): role is ContributorRole => !!role);
};

/** Ensures incrementing sequence values, matching each contributor's position in the list. */
export const renumberSequences = (contributors: Contributor[]): Contributor[] =>
  contributors.map((contributor, index) => ({ ...contributor, sequence: index + 1 }));

/** Orders contributors by their sequence, keeping the index each one has in the original array. */
export const getContributorsInSequenceOrder = (contributors: Contributor[]): ContributorEntry[] =>
  contributors
    .map((contributor, index) => ({ contributor, index }))
    .sort((a, b) => a.contributor.sequence - b.contributor.sequence);

/**
 * A person can have several roles, but not the same role twice. Used to reject duplicates when
 * adding a contributor or a role.
 */
export const hasIdentityWithRole = (contributors: Contributor[], identityKey: string, role: ContributorRole) =>
  !!identityKey &&
  contributors.some(
    (contributor) => getIdentityKey(contributor.identity) === identityKey && contributor.role?.type === role
  );
