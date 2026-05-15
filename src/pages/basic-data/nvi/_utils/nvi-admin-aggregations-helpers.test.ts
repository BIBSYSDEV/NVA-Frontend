import { describe, expect, test } from 'vitest';
import { NviPeriodTotals } from '../../../../types/nvi.types';
import { getPercentageControlledReportingPeriod } from './nvi-admin-aggregations-helpers';

const makeTotals = (undisputedProcessedCount: number, undisputedTotalCount: number): NviPeriodTotals => ({
  type: 'PeriodTotals',
  validPoints: 0,
  disputedCount: 0,
  undisputedProcessedCount,
  undisputedTotalCount,
});

describe('getPercentageControlledReportingPeriods()', () => {
  test('Returns 0 when totals is undefined', () => {
    expect(getPercentageControlledReportingPeriod(undefined)).toBe(0);
  });

  test('Returns 0 when undisputedTotalCount is 0', () => {
    expect(getPercentageControlledReportingPeriod(makeTotals(0, 0))).toBe(0);
  });

  test('Returns correct integer percentage', () => {
    expect(getPercentageControlledReportingPeriod(makeTotals(75, 100))).toBe(75);
  });

  test('Floors the result — does not round up', () => {
    expect(getPercentageControlledReportingPeriod(makeTotals(1, 3))).toBe(33);
  });

  test('Returns 100 when all candidates are processed', () => {
    expect(getPercentageControlledReportingPeriod(makeTotals(100, 100))).toBe(100);
  });
});
