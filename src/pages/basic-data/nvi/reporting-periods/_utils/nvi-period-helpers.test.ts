import { describe, expect, test } from 'vitest';
import { NviPeriod, NviPeriodStatusEnum } from '../../../../../types/nvi.types';
import { getNviPeriodStatus } from './nvi-period-helpers';

const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

const makePeriod = (startDate: string, reportingDate: string): NviPeriod => ({
  type: 'NviPeriod',
  publishingYear: '2024',
  startDate,
  reportingDate,
});

describe('getNviPeriodStatus()', () => {
  test('Returns UnopenedPeriod when startDate is in the future', () => {
    expect(getNviPeriodStatus(makePeriod(tomorrow, tomorrow))).toBe(NviPeriodStatusEnum.UnopenedPeriod);
  });

  test('Returns OpenPeriod when startDate is in the past and reportingDate is in the future', () => {
    expect(getNviPeriodStatus(makePeriod(yesterday, tomorrow))).toBe(NviPeriodStatusEnum.OpenPeriod);
  });

  test('Returns ClosedPeriod when both startDate and reportingDate are in the past', () => {
    expect(getNviPeriodStatus(makePeriod(yesterday, yesterday))).toBe(NviPeriodStatusEnum.ClosedPeriod);
  });
});
