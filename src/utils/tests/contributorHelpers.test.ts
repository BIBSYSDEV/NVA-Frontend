import { describe, expect, it } from 'vitest';
import { Contributor, ContributorRole } from '../../types/contributor.types';
import {
  appendContributor,
  getContributorsInSequenceOrder,
  getIdentityKey,
  getOtherRolesOfContributor,
  hasIdentityWithRole,
  moveContributorToSequence,
  renumberSequences,
} from '../contributor-helpers';
import { buildContributor, buildIdentity } from './testHelpers';

const personId = 'https://api.test.nva.aws.unit.no/cristin/person/1234';
const otherPersonId = 'https://api.test.nva.aws.unit.no/cristin/person/5678';

const nora = buildIdentity({ id: personId, name: 'Nora Lindqvist' });
const jonas = buildIdentity({ id: otherPersonId, name: 'Jonas Berg' });
const ada = buildIdentity({ id: 'https://api.test.nva.aws.unit.no/cristin/person/9012', name: 'Ada Voss' });

/** The names in the order the contributors are shown in, which is their sequence order. */
const shownNames = (contributors: Contributor[]) =>
  getContributorsInSequenceOrder(contributors).map(({ contributor }) => contributor.identity.name);

describe('getIdentityKey', () => {
  it('uses the id when the contributor is verified', () => {
    expect(getIdentityKey(personId)).toBe(personId);
  });

  it('returns an empty key for an unverified contributor', () => {
    expect(getIdentityKey(undefined)).toBe('');
    expect(getIdentityKey('')).toBe('');
  });
});

describe('getOtherRolesOfContributor', () => {
  it('returns the roles the same person has on their other contributors', () => {
    const contributors = [
      buildContributor({ identity: nora, role: { type: ContributorRole.Creator } }),
      buildContributor({ identity: nora, role: { type: ContributorRole.Editor } }),
      buildContributor({ identity: nora, role: { type: ContributorRole.Photographer } }),
    ];

    expect(getOtherRolesOfContributor(contributors, 0)).toEqual([ContributorRole.Editor, ContributorRole.Photographer]);
    expect(getOtherRolesOfContributor(contributors, 1)).toEqual([
      ContributorRole.Creator,
      ContributorRole.Photographer,
    ]);
  });

  it('never includes the role of the contributor itself', () => {
    const contributors = [
      buildContributor({ identity: nora, role: { type: ContributorRole.Creator } }),
      buildContributor({ identity: nora, role: { type: ContributorRole.Editor } }),
    ];

    expect(getOtherRolesOfContributor(contributors, 0)).not.toContain(ContributorRole.Creator);
  });

  it('finds the roles even when the contributors are not next to each other', () => {
    const contributors = [
      buildContributor({ identity: nora, role: { type: ContributorRole.Creator } }),
      buildContributor({ identity: jonas, role: { type: ContributorRole.Editor } }),
      buildContributor({ identity: nora, role: { type: ContributorRole.Photographer } }),
    ];

    expect(getOtherRolesOfContributor(contributors, 0)).toEqual([ContributorRole.Photographer]);
  });

  it('returns nothing for a person with only one role', () => {
    expect(getOtherRolesOfContributor([buildContributor({ identity: nora })], 0)).toEqual([]);
  });

  it('does not restrict another person', () => {
    const contributors = [
      buildContributor({ identity: nora, role: { type: ContributorRole.Creator } }),
      buildContributor({ identity: jonas, role: { type: ContributorRole.Editor } }),
    ];

    expect(getOtherRolesOfContributor(contributors, 1)).toEqual([]);
  });

  it('does not restrict unverified contributors, even with the same name', () => {
    const contributors = [
      buildContributor({
        identity: buildIdentity({ name: 'Nora Lindqvist' }),
        role: { type: ContributorRole.Creator },
      }),
      buildContributor({
        identity: buildIdentity({ name: 'Nora Lindqvist' }),
        role: { type: ContributorRole.Editor },
      }),
    ];

    expect(getOtherRolesOfContributor(contributors, 0)).toEqual([]);
  });

  it('ignores contributors without a role', () => {
    const contributors = [
      buildContributor({ identity: nora, role: { type: ContributorRole.Creator } }),
      buildContributor({ identity: nora, role: undefined }),
    ];

    expect(getOtherRolesOfContributor(contributors, 0)).toEqual([]);
  });

  it('handles an index that is out of bounds', () => {
    expect(getOtherRolesOfContributor([], 0)).toEqual([]);
  });
});

describe('renumberSequences', () => {
  it('gives incrementing sequences starting at 1', () => {
    const contributors = [
      buildContributor({ sequence: 7 }),
      buildContributor({ sequence: 2 }),
      buildContributor({ sequence: 4 }),
    ];

    expect(
      renumberSequences(contributors)
        .map((contributor) => contributor.sequence)
        .toSorted()
    ).toEqual([1, 2, 3]);
  });

  it('keeps the order the list is shown in, instead of the array order', () => {
    const contributors = [
      buildContributor({ identity: nora, sequence: 3 }),
      buildContributor({ identity: jonas, sequence: 1 }),
      buildContributor({ identity: ada, sequence: 2 }),
    ];

    // Jonas, Ada, Nora is what the user sees, and must still be what they see afterwards
    expect(renumberSequences(contributors).map((contributor) => contributor.sequence)).toEqual([3, 1, 2]);
  });

  it('closes gaps and duplicates without rearranging the list', () => {
    const contributors = [
      buildContributor({ identity: nora, sequence: 1 }),
      buildContributor({ identity: jonas, sequence: 9 }),
      buildContributor({ identity: ada, sequence: 1 }),
    ];

    expect(renumberSequences(contributors).map((contributor) => contributor.sequence)).toEqual([1, 3, 2]);
  });

  it('keeps the order and the other fields of each contributor', () => {
    const contributor = buildContributor({
      identity: nora,
      correspondingAuthor: true,
      role: { type: ContributorRole.Editor },
      sequence: 9,
    });

    expect(renumberSequences([contributor])[0]).toEqual({ ...contributor, sequence: 1 });
  });

  it('does not mutate the given list', () => {
    const contributors = [buildContributor({ sequence: 7 })];

    renumberSequences(contributors);

    expect(contributors[0].sequence).toBe(7);
  });

  it('handles an empty list', () => {
    expect(renumberSequences([])).toEqual([]);
  });
});

describe('getContributorsInSequenceOrder', () => {
  it('orders the contributors by sequence', () => {
    const contributors = [
      buildContributor({ identity: nora, sequence: 3 }),
      buildContributor({ identity: jonas, sequence: 1 }),
      buildContributor({ identity: buildIdentity({ name: 'Ada Voss' }), sequence: 2 }),
    ];

    expect(getContributorsInSequenceOrder(contributors).map((entry) => entry.contributor.sequence)).toEqual([1, 2, 3]);
  });

  it('keeps the index each contributor has in the original array', () => {
    const contributors = [
      buildContributor({ identity: nora, sequence: 3 }),
      buildContributor({ identity: jonas, sequence: 1 }),
    ];

    expect(getContributorsInSequenceOrder(contributors)).toEqual([
      { contributor: contributors[1], index: 1 },
      { contributor: contributors[0], index: 0 },
    ]);
  });

  it("does not group a person's roles, but orders by sequence regardless of role", () => {
    const contributors = [
      buildContributor({ identity: nora, role: { type: ContributorRole.Creator }, sequence: 1 }),
      buildContributor({ identity: nora, role: { type: ContributorRole.Editor }, sequence: 3 }),
      buildContributor({ identity: jonas, sequence: 2 }),
    ];

    expect(shownNames(contributors)).toEqual(['Nora Lindqvist', 'Jonas Berg', 'Nora Lindqvist']);
  });

  it('keeps the array order for contributors with the same sequence', () => {
    const contributors = [
      buildContributor({ identity: nora, sequence: 1 }),
      buildContributor({ identity: jonas, sequence: 1 }),
    ];

    expect(shownNames(contributors)).toEqual(['Nora Lindqvist', 'Jonas Berg']);
  });

  it('does not mutate the given list', () => {
    const contributors = [buildContributor({ sequence: 2 }), buildContributor({ sequence: 1 })];

    getContributorsInSequenceOrder(contributors);

    expect(contributors.map((contributor) => contributor.sequence)).toEqual([2, 1]);
  });

  it('handles an empty list', () => {
    expect(getContributorsInSequenceOrder([])).toEqual([]);
  });
});

describe('appendContributor', () => {
  it('puts the new contributor last in the shown order', () => {
    const contributors = [
      buildContributor({ identity: nora, sequence: 2 }),
      buildContributor({ identity: jonas, sequence: 1 }),
    ];
    const added = buildContributor({ identity: ada, sequence: 0 });

    const result = appendContributor(contributors, added);

    expect(getContributorsInSequenceOrder(result).map((entry) => entry.contributor.identity.name)).toEqual([
      'Jonas Berg',
      'Nora Lindqvist',
      'Ada Voss',
    ]);
  });

  it('puts it last even when the existing sequences are higher than the list length', () => {
    const contributors = [buildContributor({ identity: nora, sequence: 12 })];

    const result = appendContributor(contributors, buildContributor({ identity: ada, sequence: 0 }));

    expect(result.map((contributor) => contributor.sequence)).toEqual([1, 2]);
  });

  it('gives the first contributor sequence 1', () => {
    expect(appendContributor([], buildContributor({ identity: nora, sequence: 0 }))[0].sequence).toBe(1);
  });

  it('does not mutate the given list', () => {
    const contributors = [buildContributor({ sequence: 1 })];

    appendContributor(contributors, buildContributor({ sequence: 0 }));

    expect(contributors).toHaveLength(1);
  });
});

describe('moveContributorToSequence', () => {
  // Array order deliberately differs from the sequence order: shown as Jonas, Ada, Nora
  const contributors = [
    buildContributor({ identity: nora, sequence: 3 }),
    buildContributor({ identity: jonas, sequence: 1 }),
    buildContributor({ identity: ada, sequence: 2 }),
  ];

  it('moves a contributor down', () => {
    expect(shownNames(moveContributorToSequence(contributors, 1, 2))).toEqual([
      'Ada Voss',
      'Jonas Berg',
      'Nora Lindqvist',
    ]);
  });

  it('moves a contributor up', () => {
    expect(shownNames(moveContributorToSequence(contributors, 3, 1))).toEqual([
      'Nora Lindqvist',
      'Jonas Berg',
      'Ada Voss',
    ]);
  });

  it('leaves incrementing sequences behind', () => {
    expect(
      moveContributorToSequence(contributors, 3, 1)
        .map((contributor) => contributor.sequence)
        .toSorted()
    ).toEqual([1, 2, 3]);
  });

  it('clamps a sequence beyond the end of the list', () => {
    expect(shownNames(moveContributorToSequence(contributors, 1, 99))).toEqual([
      'Ada Voss',
      'Nora Lindqvist',
      'Jonas Berg',
    ]);
  });

  it('clamps a sequence before the start of the list', () => {
    expect(shownNames(moveContributorToSequence(contributors, 3, -5))).toEqual([
      'Nora Lindqvist',
      'Jonas Berg',
      'Ada Voss',
    ]);
  });

  it('keeps the array order, so Formik field names stay valid', () => {
    expect(moveContributorToSequence(contributors, 1, 3).map((contributor) => contributor.identity.name)).toEqual([
      'Nora Lindqvist',
      'Jonas Berg',
      'Ada Voss',
    ]);
  });

  it('returns the list unchanged when no contributor has the given sequence', () => {
    // Sequences with a gap, so renumbering as a side effect would be visible
    const withGaps = [
      buildContributor({ identity: nora, sequence: 5 }),
      buildContributor({ identity: jonas, sequence: 1 }),
    ];

    expect(moveContributorToSequence(withGaps, 42, 1)).toEqual(withGaps);
  });

  it('does not mutate the given list', () => {
    moveContributorToSequence(contributors, 1, 3);

    expect(contributors.map((contributor) => contributor.sequence)).toEqual([3, 1, 2]);
  });
});

describe('hasIdentityWithRole', () => {
  const contributors = [
    buildContributor({ identity: nora, role: { type: ContributorRole.Creator } }),
    buildContributor({ identity: jonas, role: { type: ContributorRole.Editor } }),
  ];

  it('returns true when the same person already has the role', () => {
    expect(hasIdentityWithRole(contributors, personId, ContributorRole.Creator)).toBe(true);
  });

  it('returns false when the person has another role', () => {
    expect(hasIdentityWithRole(contributors, personId, ContributorRole.Editor)).toBe(false);
  });

  it('returns false when another person has the role', () => {
    expect(
      hasIdentityWithRole(contributors, 'https://api.test.nva.aws.unit.no/cristin/person/999', ContributorRole.Creator)
    ).toBe(false);
  });

  it('returns false for an empty key, so unverified contributors are not blocked', () => {
    const unverified = [
      buildContributor({
        identity: buildIdentity({ name: 'Nora Lindqvist' }),
        role: { type: ContributorRole.Creator },
      }),
    ];

    expect(hasIdentityWithRole(unverified, '', ContributorRole.Creator)).toBe(false);
  });
});
