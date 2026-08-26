import { describe, expect, it } from 'vitest';
import { ContributorRole } from '../../types/contributor.types';
import {
  getIdentityKey,
  groupContributorsByIdentity,
  hasIdentityWithRole,
  renumberSequences,
} from '../contributor-helpers';
import { buildContributor, buildIdentity } from './testHelpers';

const personId = 'https://api.test.nva.aws.unit.no/cristin/person/1234';
const otherPersonId = 'https://api.test.nva.aws.unit.no/cristin/person/5678';

describe('getIdentityKey', () => {
  it('uses the id when the contributor is verified', () => {
    expect(getIdentityKey({ id: personId, name: 'Nora Lindqvist' })).toBe(personId);
  });

  it('falls back to the name when there is no id', () => {
    expect(getIdentityKey({ name: 'Nora Lindqvist' })).toBe('name:nora lindqvist');
  });

  it('ignores case and surplus whitespace in the name', () => {
    expect(getIdentityKey({ name: '  Nora   LINDQVIST ' })).toBe(getIdentityKey({ name: 'Nora Lindqvist' }));
  });

  it('returns an empty key when the contributor has neither id nor name', () => {
    expect(getIdentityKey({ name: '' })).toBe('');
    expect(getIdentityKey({ name: '   ' })).toBe('');
    expect(getIdentityKey({ id: '', name: '' })).toBe('');
  });
});

describe('groupContributorsByIdentity', () => {
  it('groups contributors that share an id, and keeps their original indexes', () => {
    const creator = buildContributor({
      identity: buildIdentity({ id: personId, name: 'Nora Lindqvist' }),
      role: { type: ContributorRole.Creator },
      sequence: 1,
    });
    const otherPerson = buildContributor({
      identity: buildIdentity({ id: otherPersonId, name: 'Jonas Berg' }),
      sequence: 2,
    });
    const editor = buildContributor({
      identity: buildIdentity({ id: personId, name: 'Nora Lindqvist' }),
      role: { type: ContributorRole.Editor },
      sequence: 3,
    });

    const groups = groupContributorsByIdentity([creator, otherPerson, editor]);

    expect(groups).toHaveLength(2);
    expect(groups[0].key).toBe(personId);
    expect(groups[0].entries).toEqual([
      { contributor: creator, index: 0 },
      { contributor: editor, index: 2 },
    ]);
    expect(groups[1].key).toBe(otherPersonId);
    expect(groups[1].entries).toEqual([{ contributor: otherPerson, index: 1 }]);
  });

  it('orders groups by the first contributor of each person', () => {
    const first = buildContributor({ identity: buildIdentity({ id: otherPersonId, name: 'Jonas Berg' }) });
    const second = buildContributor({ identity: buildIdentity({ id: personId, name: 'Nora Lindqvist' }) });

    const groups = groupContributorsByIdentity([first, second]);

    expect(groups.map((group) => group.key)).toEqual([otherPersonId, personId]);
  });

  it('groups unverified contributors on their name', () => {
    const creator = buildContributor({
      identity: buildIdentity({ name: 'Nora Lindqvist' }),
      role: { type: ContributorRole.Creator },
    });
    const editor = buildContributor({
      identity: buildIdentity({ name: 'nora  lindqvist' }),
      role: { type: ContributorRole.Editor },
    });

    const groups = groupContributorsByIdentity([creator, editor]);

    expect(groups).toHaveLength(1);
    expect(groups[0].entries).toHaveLength(2);
  });

  it('does not group a verified and an unverified contributor with the same name', () => {
    const verified = buildContributor({ identity: buildIdentity({ id: personId, name: 'Nora Lindqvist' }) });
    const unverified = buildContributor({ identity: buildIdentity({ name: 'Nora Lindqvist' }) });

    expect(groupContributorsByIdentity([verified, unverified])).toHaveLength(2);
  });

  it('keeps contributors without id and name as separate groups', () => {
    const groups = groupContributorsByIdentity([buildContributor(), buildContributor()]);

    expect(groups).toHaveLength(2);
    expect(groups.map((group) => group.key)).toEqual(['', '']);
    expect(groups.map((group) => group.entries[0].index)).toEqual([0, 1]);
  });

  it('exposes the identity of the group', () => {
    const identity = buildIdentity({ id: personId, name: 'Nora Lindqvist', orcId: 'https://orcid.org/0000-0001' });

    const groups = groupContributorsByIdentity([buildContributor({ identity })]);

    expect(groups[0].identity).toEqual(identity);
  });

  it('handles an empty list and a missing list', () => {
    expect(groupContributorsByIdentity([])).toEqual([]);
    expect(groupContributorsByIdentity()).toEqual([]);
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
      identity: buildIdentity({ id: personId, name: 'Nora Lindqvist' }),
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

describe('hasIdentityWithRole', () => {
  const contributors = [
    buildContributor({
      identity: buildIdentity({ id: personId, name: 'Nora Lindqvist' }),
      role: { type: ContributorRole.Creator },
    }),
    buildContributor({
      identity: buildIdentity({ name: 'Jonas Berg' }),
      role: { type: ContributorRole.Editor },
    }),
  ];

  it('finds a person that already has the given role', () => {
    expect(hasIdentityWithRole(contributors, personId, ContributorRole.Creator)).toBe(true);
  });

  it('allows the same person to be added with another role', () => {
    expect(hasIdentityWithRole(contributors, personId, ContributorRole.Editor)).toBe(false);
  });

  it('allows another person to be added with the same role', () => {
    expect(hasIdentityWithRole(contributors, otherPersonId, ContributorRole.Creator)).toBe(false);
  });

  it('matches unverified contributors on their name key', () => {
    const jonasKey = getIdentityKey({ name: 'Jonas Berg' });

    expect(hasIdentityWithRole(contributors, jonasKey, ContributorRole.Editor)).toBe(true);
    expect(hasIdentityWithRole(contributors, jonasKey, ContributorRole.Creator)).toBe(false);
  });

  it('never matches on an empty key', () => {
    const withoutIdentity = [buildContributor({ role: { type: ContributorRole.Creator } })];

    expect(hasIdentityWithRole(withoutIdentity, '', ContributorRole.Creator)).toBe(false);
  });
});
