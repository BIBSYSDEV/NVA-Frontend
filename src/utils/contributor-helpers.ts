import { Affiliation, Contributor, ContributorRole } from '../types/contributor.types';
import { uniqueBy } from './general-helpers';

export interface ContributorEntry {
  contributor: Contributor;
  /**
   * Index of the contributor in the array as it comes from and goes back to the API. That order must
   * be kept, both because Formik field names point at it and because the API preserves it, so this is
   * the index to write changes back to - never the position in a sorted view of the list.
   */
  apiIndex: number;
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
    .map((contributor, apiIndex) => ({ contributor, apiIndex }))
    .sort((a, b) => a.contributor.sequence - b.contributor.sequence);

/**
 * Writes sequence 1..n onto the contributors, so that the order of contributorsBySequence becomes
 * the sequence the list is shown in.
 *
 * Both arguments hold the same contributors in different orders: contributorsInApiOrder is the array
 * that is written back to, while contributorsBySequence only says which contributor should be shown
 * first, second and so on. Only the sequence values change, so the API order is left untouched and
 * Formik field names keep pointing at the same contributors.
 */
const applySequenceOrder = (
  contributorsInApiOrder: Contributor[],
  contributorsBySequence: ContributorEntry[]
): Contributor[] => {
  const renumbered = [...contributorsInApiOrder];

  contributorsBySequence.forEach(({ apiIndex }, position) => {
    const sequence = position + 1;
    renumbered[apiIndex] = { ...renumbered[apiIndex], sequence };
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

/** The highest sequence in use, which is the one shown last, or 0 when there are no contributors. */
const getHighestSequenceNumber = (contributors: Contributor[]) =>
  Math.max(0, ...contributors.map(({ sequence }) => sequence));

/** Adds a contributor after all the others in the sequence order. */
export const appendContributor = (contributors: Contributor[], newContributor: Contributor): Contributor[] =>
  renumberSequences([...contributors, { ...newContributor, sequence: getHighestSequenceNumber(contributors) + 1 }]);

/**
 * The position a sequence points at in a list ordered by sequence, which is the only order where a
 * sequence has a position at all. Sequences are 1-based while positions are 0-based, and a sequence
 * typed by the user can point outside the list, so it is limited to the first and last position.
 */
const getPositionInSequenceOrder = (sequence: number, listLength: number) => {
  const firstPosition = 0;
  const lastPosition = listLength - 1;
  const wantedPosition = sequence - 1;
  const notBeforeFirst = Math.max(wantedPosition, firstPosition);

  return Math.min(notBeforeFirst, lastPosition);
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
  const contributorsBySequence = getContributorsInSequenceOrder(contributors);
  const oldPosition = contributorsBySequence.findIndex(({ contributor }) => contributor.sequence === oldSequence);

  if (oldPosition < 0) {
    return contributors;
  }

  const newPosition = getPositionInSequenceOrder(newSequence, contributorsBySequence.length);
  const [movedEntry] = contributorsBySequence.splice(oldPosition, 1);
  contributorsBySequence.splice(newPosition, 0, movedEntry);

  return applySequenceOrder(contributors, contributorsBySequence);
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

/**
 * Key that identifies the organization of an affiliation. Unconfirmed affiliations, and organizations
 * without an ID, have no key and are never treated as the same organization.
 */
const getOrganizationId = (affiliation: Affiliation) =>
  affiliation.type === 'Organization' ? affiliation.id || undefined : undefined;

const isSameOrganization = (affiliation: Affiliation, other: Affiliation) => {
  const organizationId = getOrganizationId(affiliation);
  return organizationId !== undefined && organizationId === getOrganizationId(other);
};

/**
 * The 1-based numbers of the contributor's affiliations in the list of distinct units, sorted and without
 * duplicates. A contributor can have the same organization as affiliation several times, which should only
 * give one number. Affiliations that are not in the list of units are left out.
 *
 * @param affiliations The contributor's affiliations.
 * @param distinctUnits The IDs of all units on the registration, in the order they are numbered in.
 * @returns The affiliation numbers in ascending order.
 */
export const getAffiliationNumbers = (affiliations: Affiliation[] = [], distinctUnits: string[]): number[] => {
  const organizationIds = affiliations.flatMap((affiliation) => getOrganizationId(affiliation) ?? []);
  const unitIndexes = organizationIds
    .map((organizationId) => distinctUnits.indexOf(organizationId))
    .filter((unitIndex) => unitIndex !== -1);
  const uniqueNumbers = new Set(unitIndexes.map((unitIndex) => unitIndex + 1));
  return [...uniqueNumbers].sort((a, b) => a - b);
};

/**
 * The affiliations to show for a contributor, where each organization is only included once even if the
 * contributor has it several times.
 *
 * @param affiliations The contributor's affiliations, possibly with duplicates.
 * @returns Each affiliation to show, with the index it has in the original list.
 */
export const getAffiliationsToShow = (affiliations: Affiliation[]) => {
  const affiliationsWithIndex = affiliations.map((affiliation, index) => ({ affiliation, index }));
  return uniqueBy(affiliationsWithIndex, ({ affiliation }) => getOrganizationId(affiliation));
};

/**
 * Adds the new affiliations at the end, leaving out organizations that are already in the list.
 *
 * @param affiliations The contributor's current affiliations.
 * @param newAffiliations The affiliations to add.
 * @returns The combined affiliations, where each organization is only included once.
 */
export const addAffiliations = (affiliations: Affiliation[], newAffiliations: Affiliation[]): Affiliation[] =>
  uniqueBy([...affiliations, ...newAffiliations], getOrganizationId);

/**
 * Removes the affiliation at the given index, and any duplicates of the same organization.
 *
 * @param affiliations The contributor's affiliations.
 * @param index The index of the affiliation to remove.
 * @returns The affiliations that are left, or the list unchanged if the index is out of range.
 */
export const removeAffiliation = (affiliations: Affiliation[], index: number): Affiliation[] => {
  const affiliationToRemove = affiliations[index];
  if (!affiliationToRemove) {
    return affiliations;
  }

  return affiliations.filter((affiliation, affiliationIndex) => {
    const isAffiliationToRemove = affiliationIndex === index;
    const isDuplicate = isSameOrganization(affiliationToRemove, affiliation);
    return !isAffiliationToRemove && !isDuplicate;
  });
};

/**
 * Replaces the affiliation at the given index, and removes any duplicates of the replaced organization.
 *
 * @param affiliations The contributor's affiliations.
 * @param index The index of the affiliation to replace.
 * @param newAffiliation The affiliation to put in its place.
 * @returns The affiliations with the replacement, in the original order, or the list unchanged if the index
 * is out of range.
 */
export const replaceAffiliation = (
  affiliations: Affiliation[],
  index: number,
  newAffiliation: Affiliation
): Affiliation[] => {
  const affiliationToReplace = affiliations[index];
  if (!affiliationToReplace) {
    return affiliations;
  }

  return affiliations.flatMap((affiliation, affiliationIndex) => {
    if (affiliationIndex === index) {
      return [newAffiliation];
    }
    const isDuplicate = isSameOrganization(affiliationToReplace, affiliation);
    return isDuplicate ? [] : [affiliation];
  });
};
