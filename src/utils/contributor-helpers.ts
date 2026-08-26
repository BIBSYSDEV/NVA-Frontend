import { Contributor, ContributorRole, Identity } from '../types/contributor.types';

export interface ContributorGroupEntry {
  contributor: Contributor;
  /** Index of the contributor in the original contributors array, to be used in Formik field names. */
  index: number;
}

export interface ContributorGroup {
  key: string;
  identity: Identity;
  entries: ContributorGroupEntry[];
}

const normalizeName = (name = '') => name.trim().replace(/\s+/g, ' ').toLocaleLowerCase();

/**
 * Key used to decide which contributors describe the same person. A person with several roles is
 * stored as one contributor per role, all sharing the same identity.
 *
 * Verified contributors are grouped on their Cristin ID. Unverified contributors have no ID, so they
 * are grouped on their name instead. A contributor with neither cannot be grouped, and gets an empty
 * key: groupContributorsByIdentity keeps those as separate groups.
 */
export const getIdentityKey = ({ id, name }: Pick<Identity, 'id' | 'name'>): string => {
  if (id) {
    return id;
  }
  const normalizedName = normalizeName(name);
  return normalizedName ? `name:${normalizedName}` : '';
};

/**
 * Groups contributors that share an identity, so a person with several roles can be presented as one
 * person. Groups are ordered by each person's first contributor, and each entry keeps the index it
 * had in the original array.
 */
export const groupContributorsByIdentity = (contributors: Contributor[] = []): ContributorGroup[] => {
  const groups: ContributorGroup[] = [];
  const groupIndexPerKey = new Map<string, number>();

  contributors.forEach((contributor, index) => {
    const key = getIdentityKey(contributor.identity);
    const existingGroupIndex = key ? groupIndexPerKey.get(key) : undefined;

    if (existingGroupIndex === undefined) {
      if (key) {
        groupIndexPerKey.set(key, groups.length);
      }
      groups.push({ key, identity: contributor.identity, entries: [{ contributor, index }] });
    } else {
      groups[existingGroupIndex].entries.push({ contributor, index });
    }
  });

  return groups;
};

/** Ensures incrementing sequence values, matching each contributor's position in the list. */
export const renumberSequences = (contributors: Contributor[]): Contributor[] =>
  contributors.map((contributor, index) => ({ ...contributor, sequence: index + 1 }));

/**
 * Adds a contributor to the list, and renumbers the sequences. A new role for a person who is already
 * a contributor is inserted right after that person's other roles, so their roles stay next to each
 * other and get adjacent sequence numbers.
 */
export const insertContributor = (contributors: Contributor[], newContributor: Contributor): Contributor[] => {
  const key = getIdentityKey(newContributor.identity);
  const existingGroup = key ? groupContributorsByIdentity(contributors).find((group) => group.key === key) : undefined;

  if (!existingGroup) {
    return renumberSequences([...contributors, newContributor]);
  }

  const insertIndex = existingGroup.entries[existingGroup.entries.length - 1].index + 1;
  return renumberSequences([...contributors.slice(0, insertIndex), newContributor, ...contributors.slice(insertIndex)]);
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
