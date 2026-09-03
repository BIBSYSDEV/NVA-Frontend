import { Contributor, ContributorRole } from '../types/contributor.types';

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
export const getIdentityKey = (id?: string): string => id ?? '';

/**
 * The roles the same person already has on their other contributors. A contributor cannot change to
 * one of these, since a person can only have each role once.
 */
export const getOtherRolesOfContributor = (contributors: Contributor[], index: number): ContributorRole[] => {
  const identityKey = getIdentityKey(contributors[index]?.identity.id);

  if (!identityKey) {
    return [];
  }

  return contributors
    .filter((contributor, thisIndex) => thisIndex !== index && getIdentityKey(contributor.identity.id) === identityKey)
    .map((contributor) => contributor.role?.type)
    .filter((role): role is ContributorRole => !!role);
};

/** Orders contributors by their sequence, keeping the index each one has in the original array. */
export const getContributorsInSequenceOrder = (contributors: Contributor[]): ContributorEntry[] =>
  contributors
    .map((contributor, index) => ({ contributor, index }))
    .sort((a, b) => a.contributor.sequence - b.contributor.sequence);

/**
 * Gives the contributors sequence 1..n following the given order. Only the sequence values change:
 * the array order is left untouched, so Formik field names keep pointing at the same contributors.
 */
const applySequenceOrder = (contributors: Contributor[], orderedEntries: ContributorEntry[]): Contributor[] => {
  const renumbered = [...contributors];

  orderedEntries.forEach(({ index }, position) => {
    const sequence = position + 1;
    renumbered[index] = { ...renumbered[index], sequence };
  });

  return renumbered;
};

/**
 * Ensures incrementing sequence values starting at 1, following the sequence order rather than the
 * array order. The list is ordered by sequence when it is shown, so renumbering by array position
 * would silently rearrange the list whenever the two disagree.
 */
export const renumberSequences = (contributors: Contributor[]): Contributor[] =>
  applySequenceOrder(contributors, getContributorsInSequenceOrder(contributors));

/** The sequence of the contributor shown last, or 0 when there are none. */
const getLastSequence = (contributors: Contributor[]) => Math.max(0, ...contributors.map(({ sequence }) => sequence));

/** Adds a contributor after all the others in the sequence order. */
export const appendContributor = (contributors: Contributor[], newContributor: Contributor): Contributor[] =>
  renumberSequences([...contributors, { ...newContributor, sequence: getLastSequence(contributors) + 1 }]);

/**
 * The position a sequence points at in the shown list. Sequences are 1-based while positions are
 * 0-based, and a sequence typed by the user can point outside the list, so it is limited to it.
 */
const getPositionForSequence = (sequence: number, listLength: number) => {
  const position = sequence - 1;
  const lastPosition = listLength - 1;

  return Math.min(Math.max(position, 0), lastPosition);
};

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
    return contributors;
  }

  const newPosition = getPositionForSequence(newSequence, entries.length);
  const [movedEntry] = entries.splice(oldPosition, 1);
  entries.splice(newPosition, 0, movedEntry);

  return applySequenceOrder(contributors, entries);
};

/**
 * A person can have several roles, but not the same role twice. Used to reject duplicates when
 * adding a contributor or a role.
 */
export const hasIdentityWithRole = (contributors: Contributor[], identityKey: string, role: ContributorRole) =>
  !!identityKey &&
  contributors.some(
    (contributor) => getIdentityKey(contributor.identity.id) === identityKey && contributor.role?.type === role
  );
