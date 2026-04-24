import { describe, expect, test } from 'vitest';
import { NviPeriodByGlobalApprovalStatus } from '../../../types/nvi.types';
import { getCandidatesForReporting } from './useNviPeriodReportNumbers';

const makeGlobalApprovalStatus = (
  overrides: Partial<NviPeriodByGlobalApprovalStatus> = {}
): NviPeriodByGlobalApprovalStatus => ({
  type: 'CandidatesByGlobalApprovalStatus',
  dispute: 0,
  pending: 0,
  approved: 0,
  rejected: 0,
  ...overrides,
});

describe('getCandidatesForReporting()', () => {
  test('Returns undefined when globalApprovalStatus is undefined', () => {
    expect(getCandidatesForReporting(undefined)).toBeUndefined();
  });

  test('Returns 0 when all statuses are 0', () => {
    expect(getCandidatesForReporting(makeGlobalApprovalStatus())).toBe(0);
  });

  test('Returns the sum of pending, approved and rejected', () => {
    expect(getCandidatesForReporting(makeGlobalApprovalStatus({ pending: 2, approved: 5, rejected: 3 }))).toBe(10);
  });

  test('Returns correct sum when only one status has a value', () => {
    expect(getCandidatesForReporting(makeGlobalApprovalStatus({ approved: 7 }))).toBe(7);
  });

  test('Does not include dispute in the sum', () => {
    expect(
      getCandidatesForReporting(makeGlobalApprovalStatus({ pending: 1, approved: 2, rejected: 3, dispute: 10 }))
    ).toBe(6);
  });
});
