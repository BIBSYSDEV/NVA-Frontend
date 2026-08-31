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

/** Orders contributors by their sequence, keeping the index each one has in the original array. */
export const getContributorsInSequenceOrder = (contributors: Contributor[]): ContributorEntry[] =>
  contributors
    .map((contributor, index) => ({ contributor, index }))
    .sort((a, b) => a.contributor.sequence - b.contributor.sequence);

/** Maps each contributor's index in the array to its position in the given sequence order. */
const toSequenceByIndex = (entries: ContributorEntry[]) =>
  new Map<number, number>(entries.map(({ index }, position) => [index, position + 1]));

/**
 * Ensures incrementing sequence values starting at 1, following the sequence order rather than the
 * array order. The list is ordered by sequence when it is shown, so renumbering by array position
 * would silently rearrange the list whenever the two disagree. The array order is left untouched,
 * so Formik field names keep pointing at the same contributors.
 */
export const renumberSequences = (contributors: Contributor[]): Contributor[] => {
  const sequenceByIndex = toSequenceByIndex(getContributorsInSequenceOrder(contributors));

  return contributors.map((contributor, index) => ({
    ...contributor,
    sequence: sequenceByIndex.get(index) ?? index + 1,
  }));
};

/** Adds a contributor after all the others in the sequence order. */
export const appendContributor = (contributors: Contributor[], newContributor: Contributor): Contributor[] =>
  renumberSequences([
    ...contributors,
    { ...newContributor, sequence: Math.max(0, ...contributors.map(({ sequence }) => sequence)) + 1 },
  ]);

/**
 * Moves the contributor with sequence oldSequence to newSequence, renumbering the others to keep
 * incrementing sequences. Only sequence values change, never the array order.
 */
export const moveContributorToSequence = (
  contributors: Contributor[],
  oldSequence: number,
  newSequence: number
): Contributor[] => {
  const entries = getContributorsInSequenceOrder(contributors);
  const oldPosition = entries.findIndex(({ contributor }) => contributor.sequence === oldSequence);

  if (oldPosition < 0) {
    return renumberSequences(contributors);
  }

  const newPosition = Math.min(Math.max(newSequence - 1, 0), entries.length - 1);
  const [movedEntry] = entries.splice(oldPosition, 1);
  entries.splice(newPosition, 0, movedEntry);

  const sequenceByIndex = toSequenceByIndex(entries);

  return contributors.map((contributor, index) => ({
    ...contributor,
    sequence: sequenceByIndex.get(index) ?? contributor.sequence,
  }));
};

/**
 * A person can have several roles, but not the same role twice. Used to reject duplicates when
 * adding a contributor or a role.
 */
export const hasIdentityWithRole = (contributors: Contributor[], identityKey: string, role: ContributorRole) =>
  !!identityKey &&
  contributors.some(
    (contributor) => getIdentityKey(contributor.identity) === identityKey && contributor.role?.type === role
  );
