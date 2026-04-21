import { describe, expect, test } from 'vitest';
import { ApprovalStatusAggregation } from '../../../types/nvi.types';
import { getTotalResults } from './useNviReportNumbers';

const makeApprovalStatus = (overrides: Partial<ApprovalStatusAggregation> = {}): ApprovalStatusAggregation => ({
  New: 0,
  Pending: 0,
  Approved: 0,
  Rejected: 0,
  ...overrides,
});

describe('getTotalResults()', () => {
  test('Returns undefined when approvalStatus is undefined', () => {
    expect(getTotalResults(undefined)).toBeUndefined();
  });

  test('Returns 0 when all statuses are 0', () => {
    expect(getTotalResults(makeApprovalStatus())).toBe(0);
  });

  test('Returns the sum of all approval statuses', () => {
    expect(getTotalResults(makeApprovalStatus({ New: 2, Pending: 3, Approved: 5, Rejected: 1 }))).toBe(11);
  });

  test('Returns correct sum when only one status has a value', () => {
    expect(getTotalResults(makeApprovalStatus({ Approved: 7 }))).toBe(7);
  });
});
