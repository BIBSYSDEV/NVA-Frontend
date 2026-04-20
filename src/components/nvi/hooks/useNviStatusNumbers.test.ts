import { describe, expect, test } from 'vitest';
import { ApprovalStatusAggregation } from '../../../types/nvi.types';
import { getNumResults } from './useNviStatusNumbers';

const makeApprovalStatus = (overrides: Partial<ApprovalStatusAggregation> = {}): ApprovalStatusAggregation => ({
  New: 0,
  Pending: 0,
  Approved: 0,
  Rejected: 0,
  ...overrides,
});

describe('getNumResults()', () => {
  test('Returns undefined when approvalStatus is undefined', () => {
    expect(getNumResults(undefined)).toBeUndefined();
  });

  test('Returns 0 when all statuses are 0', () => {
    expect(getNumResults(makeApprovalStatus())).toBe(0);
  });

  test('Returns the sum of all approval statuses', () => {
    expect(getNumResults(makeApprovalStatus({ New: 2, Pending: 3, Approved: 5, Rejected: 1 }))).toBe(11);
  });

  test('Returns correct sum when only one status has a value', () => {
    expect(getNumResults(makeApprovalStatus({ Approved: 7 }))).toBe(7);
  });
});
