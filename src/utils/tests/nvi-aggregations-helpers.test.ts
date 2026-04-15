import { describe, expect, test } from 'vitest';
import { NviInstitutionStatusResponse } from '../../types/nvi.types';
import { Organization } from '../../types/organization.types';
import { hasOrDescendantHasCandidates } from '../nvi-aggregations-helpers';

const makeAggregations = (counts: Record<string, number>): NviInstitutionStatusResponse => ({
  year: '2024',
  topLevelOrganizationId: '1',
  totals: {
    type: 'TopLevelAggregation',
    candidateCount: 0,
    points: 0,
    approvalStatus: { New: 0, Pending: 0, Approved: 0, Rejected: 0 },
    globalApprovalStatus: { Approved: 0, Dispute: 0, Rejected: 0, Pending: 0 },
  },
  byOrganization: Object.fromEntries(
    Object.entries(counts).map(([id, candidateCount]) => [
      id,
      {
        type: 'DirectAffiliationAggregation' as const,
        candidateCount,
        points: 0,
        approvalStatus: { New: 0, Pending: 0, Approved: candidateCount, Rejected: 0 },
        globalApprovalStatus: { Approved: 0, Dispute: 0, Rejected: 0, Pending: 0 },
      },
    ])
  ),
});

const orgId = 'org1';
const childId = 'org1.1';
const grandChildId = 'org/1.1.1';

const grandChild: Organization = {
  type: 'Organization',
  id: grandChildId,
  labels: { en: 'Grand child' },
};

const child: Organization = {
  type: 'Organization',
  id: childId,
  labels: { en: 'Child' },
  hasPart: [grandChild],
};

const organization: Organization = {
  type: 'Organization',
  id: orgId,
  labels: { en: 'Organization' },
  hasPart: [child],
};

describe('hasOrDescendantHasCandidates()', () => {
  test('Returns true when the organization itself has candidates', () => {
    const aggregations = makeAggregations({ [orgId]: 3 });
    expect(hasOrDescendantHasCandidates(organization, aggregations)).toBe(true);
  });

  test('Returns true when a direct child has candidates', () => {
    const aggregations = makeAggregations({ [orgId]: 0, [childId]: 2 });
    expect(hasOrDescendantHasCandidates(organization, aggregations)).toBe(true);
  });

  test('Returns true when only a grandchild has candidates', () => {
    const aggregations = makeAggregations({ [orgId]: 0, [childId]: 0, [grandChildId]: 1 });
    expect(hasOrDescendantHasCandidates(organization, aggregations)).toBe(true);
  });

  test('Returns false when neither the organization nor any descendants have candidates', () => {
    const aggregations = makeAggregations({ [orgId]: 0, [childId]: 0, [grandChildId]: 0 });
    expect(hasOrDescendantHasCandidates(organization, aggregations)).toBe(false);
  });

  test('Returns false when aggregations are undefined', () => {
    expect(hasOrDescendantHasCandidates(organization, undefined)).toBe(false);
  });

  test('Returns false for a leaf organization with no candidates', () => {
    const aggregations = makeAggregations({ [grandChildId]: 0 });
    expect(hasOrDescendantHasCandidates(grandChild, aggregations)).toBe(false);
  });

  test('Returns true for a leaf organization with candidates', () => {
    const aggregations = makeAggregations({ [grandChildId]: 5 });
    expect(hasOrDescendantHasCandidates(grandChild, aggregations)).toBe(true);
  });
});
