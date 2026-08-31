import { describe, expect, it } from 'vitest';
import { ContributorRole } from '../../types/contributor.types';
import {
  getContributorsInSequenceOrder,
  getIdentityKey,
  getRolesOnOtherContributors,
  hasIdentityWithRole,
  renumberSequences,
} from '../contributor-helpers';
import { buildContributor, buildIdentity } from './testHelpers';

const personId = 'https://api.test.nva.aws.unit.no/cristin/person/1234';
const otherPersonId = 'https://api.test.nva.aws.unit.no/cristin/person/5678';

const nora = buildIdentity({ id: personId, name: 'Nora Lindqvist' });
const jonas = buildIdentity({ id: otherPersonId, name: 'Jonas Berg' });

describe('getIdentityKey', () => {
  it('uses the id when the contributor is verified', () => {
    expect(getIdentityKey({ id: personId })).toBe(personId);
  });

  it('returns an empty key for an unverified contributor', () => {
    expect(getIdentityKey({})).toBe('');
    expect(getIdentityKey({ id: '' })).toBe('');
  });
});

describe('getRolesOnOtherContributors', () => {
  it('returns the roles the same person has on their other contributors', () => {
    const contributors = [
      buildContributor({ identity: nora, role: { type: ContributorRole.Creator } }),
      buildContributor({ identity: nora, role: { type: ContributorRole.Editor } }),
      buildContributor({ identity: nora, role: { type: ContributorRole.Photographer } }),
    ];

    expect(getRolesOnOtherContributors(contributors, 0)).toEqual([
      ContributorRole.Editor,
      ContributorRole.Photographer,
    ]);
    expect(getRolesOnOtherContributors(contributors, 1)).toEqual([
      ContributorRole.Creator,
      ContributorRole.Photographer,
    ]);
  });

  it('never includes the role of the contributor itself', () => {
    const contributors = [
      buildContributor({ identity: nora, role: { type: ContributorRole.Creator } }),
      buildContributor({ identity: nora, role: { type: ContributorRole.Editor } }),
    ];

    expect(getRolesOnOtherContributors(contributors, 0)).not.toContain(ContributorRole.Creator);
  });

  it('finds the roles even when the contributors are not next to each other', () => {
    const contributors = [
      buildContributor({ identity: nora, role: { type: ContributorRole.Creator } }),
      buildContributor({ identity: jonas, role: { type: ContributorRole.Editor } }),
      buildContributor({ identity: nora, role: { type: ContributorRole.Photographer } }),
    ];

    expect(getRolesOnOtherContributors(contributors, 0)).toEqual([ContributorRole.Photographer]);
  });

  it('returns nothing for a person with only one role', () => {
    expect(getRolesOnOtherContributors([buildContributor({ identity: nora })], 0)).toEqual([]);
  });

  it('does not restrict another person', () => {
    const contributors = [
      buildContributor({ identity: nora, role: { type: ContributorRole.Creator } }),
      buildContributor({ identity: jonas, role: { type: ContributorRole.Editor } }),
    ];

    expect(getRolesOnOtherContributors(contributors, 1)).toEqual([]);
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

    expect(getRolesOnOtherContributors(contributors, 0)).toEqual([]);
  });

  it('ignores contributors without a role', () => {
    const contributors = [
      buildContributor({ identity: nora, role: { type: ContributorRole.Creator } }),
      buildContributor({ identity: nora, role: undefined }),
    ];

    expect(getRolesOnOtherContributors(contributors, 0)).toEqual([]);
  });

  it('handles an index that is out of bounds', () => {
    expect(getRolesOnOtherContributors([], 0)).toEqual([]);
  });
});

describe('renumberSequences', () => {
  it('gives incrementing sequences starting at 1', () => {
    const contributors = [
      buildContributor({ sequence: 7 }),
      buildContributor({ sequence: 2 }),
      buildContributor({ sequence: 4 }),
    ];

    expect(renumberSequences(contributors).map((contributor) => contributor.sequence)).toEqual([1, 2, 3]);
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

  it('does not separate the roles of a person that already has adjacent sequences', () => {
    const contributors = [
      buildContributor({ identity: nora, role: { type: ContributorRole.Creator }, sequence: 1 }),
      buildContributor({ identity: jonas, sequence: 3 }),
      buildContributor({ identity: nora, role: { type: ContributorRole.Editor }, sequence: 2 }),
    ];

    expect(getContributorsInSequenceOrder(contributors).map((entry) => entry.index)).toEqual([0, 2, 1]);
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

describe('hasIdentityWithRole', () => {
  const contributors = [
    buildContributor({ identity: nora, role: { type: ContributorRole.Creator } }),
    buildContributor({ identity: jonas, role: { type: ContributorRole.Editor } }),
  ];

  it('finds a person that already has the given role', () => {
    expect(hasIdentityWithRole(contributors, personId, ContributorRole.Creator)).toBe(true);
  });

  it('allows the same person to be added with another role', () => {
    expect(hasIdentityWithRole(contributors, personId, ContributorRole.Editor)).toBe(false);
  });

  it('allows another person to be added with the same role', () => {
    expect(
      hasIdentityWithRole(contributors, 'https://api.test.nva.aws.unit.no/cristin/person/999', ContributorRole.Creator)
    ).toBe(false);
  });

  it('never matches on an empty key, so unverified contributors are not blocked', () => {
    const unverified = [
      buildContributor({
        identity: buildIdentity({ name: 'Nora Lindqvist' }),
        role: { type: ContributorRole.Creator },
      }),
    ];

    expect(hasIdentityWithRole(unverified, '', ContributorRole.Creator)).toBe(false);
  });
});
