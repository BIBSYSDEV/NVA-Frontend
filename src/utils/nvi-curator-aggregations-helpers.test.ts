import { describe, expect, test } from 'vitest';
import { NviInstitutionStatusResponse } from '../types/nvi.types';
import { Organization } from '../types/organization.types';
import {
  hasSubUnitWithCandidates,
  hasSubUnitWithPointValues,
  selfOrDescendantHasCandidates,
  selfOrDescendantHasPointValues,
} from './nvi-curator-aggregations-helpers';

interface OrgValues {
  candidateCount?: number;
  points?: number;
  approved?: number;
}

const makeAggregations = (orgValues: Record<string, OrgValues>): NviInstitutionStatusResponse => ({
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
    Object.entries(orgValues).map(([id, { candidateCount = 0, points = 0, approved = 0 }]) => [
      id,
      {
        type: 'DirectAffiliationAggregation' as const,
        candidateCount,
        points,
        approvalStatus: { New: 0, Pending: 0, Approved: 0, Rejected: 0 },
        globalApprovalStatus: { Approved: approved, Dispute: 0, Rejected: 0, Pending: 0 },
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

describe('selfOrDescendantHasCandidates()', () => {
  test('Returns true when the organization itself has candidates', () => {
    const aggregations = makeAggregations({ [orgId]: { candidateCount: 3 } });
    expect(selfOrDescendantHasCandidates(organization, aggregations)).toBe(true);
  });

  test('Returns true when a direct child has candidates', () => {
    const aggregations = makeAggregations({ [orgId]: {}, [childId]: { candidateCount: 2 } });
    expect(selfOrDescendantHasCandidates(organization, aggregations)).toBe(true);
  });

  test('Returns true when only a grandchild has candidates', () => {
    const aggregations = makeAggregations({ [orgId]: {}, [childId]: {}, [grandChildId]: { candidateCount: 1 } });
    expect(selfOrDescendantHasCandidates(organization, aggregations)).toBe(true);
  });

  test('Returns false when neither the organization nor any descendants have candidates', () => {
    const aggregations = makeAggregations({ [orgId]: {}, [childId]: {}, [grandChildId]: {} });
    expect(selfOrDescendantHasCandidates(organization, aggregations)).toBe(false);
  });

  test('Returns false when aggregations are undefined', () => {
    expect(selfOrDescendantHasCandidates(organization, undefined)).toBe(false);
  });

  test('Returns false for a leaf organization with no candidates', () => {
    const aggregations = makeAggregations({ [grandChildId]: {} });
    expect(selfOrDescendantHasCandidates(grandChild, aggregations)).toBe(false);
  });

  test('Returns true for a leaf organization with candidates', () => {
    const aggregations = makeAggregations({ [grandChildId]: { candidateCount: 5 } });
    expect(selfOrDescendantHasCandidates(grandChild, aggregations)).toBe(true);
  });
});

describe('selfOrDescendantHasPointValues()', () => {
  test('Returns true when the organization has points', () => {
    const aggregations = makeAggregations({ [orgId]: { points: 1.5 } });
    expect(selfOrDescendantHasPointValues(organization, aggregations)).toBe(true);
  });

  test('Returns true when the organization has approved publications (points = 0)', () => {
    const aggregations = makeAggregations({ [orgId]: { approved: 2 } });
    expect(selfOrDescendantHasPointValues(organization, aggregations)).toBe(true);
  });

  test('Returns true when a direct child has point values', () => {
    const aggregations = makeAggregations({ [orgId]: {}, [childId]: { points: 0.5 } });
    expect(selfOrDescendantHasPointValues(organization, aggregations)).toBe(true);
  });

  test('Returns true when only a grandchild has point values', () => {
    const aggregations = makeAggregations({ [orgId]: {}, [childId]: {}, [grandChildId]: { approved: 1 } });
    expect(selfOrDescendantHasPointValues(organization, aggregations)).toBe(true);
  });

  test('Returns false when no organization or descendants have point values', () => {
    const aggregations = makeAggregations({ [orgId]: {}, [childId]: {}, [grandChildId]: {} });
    expect(selfOrDescendantHasPointValues(organization, aggregations)).toBe(false);
  });

  test('Returns false when aggregations are undefined', () => {
    expect(selfOrDescendantHasPointValues(organization, undefined)).toBe(false);
  });

  test('Returns false for a leaf organization with neither points nor approvals', () => {
    const aggregations = makeAggregations({ [grandChildId]: {} });
    expect(selfOrDescendantHasPointValues(grandChild, aggregations)).toBe(false);
  });

  test('Returns true for a leaf organization with points', () => {
    const aggregations = makeAggregations({ [grandChildId]: { points: 3 } });
    expect(selfOrDescendantHasPointValues(grandChild, aggregations)).toBe(true);
  });

  test('Returns true for a leaf organization with approvals but no points', () => {
    const aggregations = makeAggregations({ [grandChildId]: { approved: 1 } });
    expect(selfOrDescendantHasPointValues(grandChild, aggregations)).toBe(true);
  });
});

describe('hasSubUnitWithCandidates()', () => {
  test('Returns true when a direct child has candidates', () => {
    const aggregations = makeAggregations({ [orgId]: {}, [childId]: { candidateCount: 2 } });
    expect(hasSubUnitWithCandidates(organization, aggregations)).toBe(true);
  });

  test('Returns true when only a grandchild has candidates', () => {
    const aggregations = makeAggregations({ [orgId]: {}, [childId]: {}, [grandChildId]: { candidateCount: 1 } });
    expect(hasSubUnitWithCandidates(organization, aggregations)).toBe(true);
  });

  test('Returns false when only the organization itself has candidates', () => {
    const aggregations = makeAggregations({ [orgId]: { candidateCount: 3 }, [childId]: {}, [grandChildId]: {} });
    expect(hasSubUnitWithCandidates(organization, aggregations)).toBe(false);
  });

  test('Returns false when aggregations are undefined', () => {
    expect(hasSubUnitWithCandidates(organization, undefined)).toBe(false);
  });

  test('Returns false for a leaf organization with candidates', () => {
    const aggregations = makeAggregations({ [grandChildId]: { candidateCount: 5 } });
    expect(hasSubUnitWithCandidates(grandChild, aggregations)).toBe(false);
  });
});

describe('hasSubUnitWithPointValues()', () => {
  test('Returns true when a direct child has points', () => {
    const aggregations = makeAggregations({ [orgId]: {}, [childId]: { points: 0.5 } });
    expect(hasSubUnitWithPointValues(organization, aggregations)).toBe(true);
  });

  test('Returns true when only a grandchild has approved publications', () => {
    const aggregations = makeAggregations({ [orgId]: {}, [childId]: {}, [grandChildId]: { approved: 1 } });
    expect(hasSubUnitWithPointValues(organization, aggregations)).toBe(true);
  });

  test('Returns false when only the organization itself has point values', () => {
    const aggregations = makeAggregations({ [orgId]: { points: 1.5 }, [childId]: {}, [grandChildId]: {} });
    expect(hasSubUnitWithPointValues(organization, aggregations)).toBe(false);
  });

  test('Returns false when aggregations are undefined', () => {
    expect(hasSubUnitWithPointValues(organization, undefined)).toBe(false);
  });

  test('Returns false for a leaf organization with points', () => {
    const aggregations = makeAggregations({ [grandChildId]: { points: 3 } });
    expect(hasSubUnitWithPointValues(grandChild, aggregations)).toBe(false);
  });
});
