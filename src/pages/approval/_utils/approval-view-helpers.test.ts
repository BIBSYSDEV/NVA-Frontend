import { describe, expect, test } from 'vitest';
import { ApprovalEvent, ApprovalEventType, ApprovalRegion, ApprovalStatus } from '../../../types/approval.types';
import {
  getApprovalPeriod,
  getInvestigatorName,
  getRegionStatus,
  getTrialSiteAffiliation,
} from './approval-view-helpers';

const events: ApprovalEvent[] = [
  { type: ApprovalEventType.TrialStart, region: 'EEA', date: '2023-03-28' },
  { type: ApprovalEventType.TrialEnd, region: 'EEA', date: '2025-11-18' },
  { type: ApprovalEventType.TrialStart, region: 'Norway', date: '2023-05-10' },
  { type: ApprovalEventType.RecruitmentStart, region: 'Norway', date: '2023-09-13' },
];

describe('getApprovalPeriod()', () => {
  test('Returns the start and end dates in the region, ignoring the case of the region', () => {
    expect(
      getApprovalPeriod(events, ApprovalEventType.TrialStart, ApprovalEventType.TrialEnd, ApprovalRegion.Eea)
    ).toEqual({ start: '2023-03-28', end: '2025-11-18' });
  });

  test('Returns only the start date when the period has not ended', () => {
    expect(
      getApprovalPeriod(events, ApprovalEventType.TrialStart, ApprovalEventType.TrialEnd, ApprovalRegion.Norway)
    ).toEqual({ start: '2023-05-10', end: undefined });
  });

  test('Returns null when the region has no dates for the period', () => {
    expect(
      getApprovalPeriod(
        events,
        ApprovalEventType.RecruitmentStart,
        ApprovalEventType.RecruitmentEnd,
        ApprovalRegion.Eea
      )
    ).toBeNull();
    expect(
      getApprovalPeriod(undefined, ApprovalEventType.TrialStart, ApprovalEventType.TrialEnd, ApprovalRegion.Norway)
    ).toBeNull();
  });
});

describe('getRegionStatus()', () => {
  const statuses: ApprovalStatus[] = [
    { type: 'Status', region: 'eea', status: 'Ended' },
    { type: 'Status', region: 'norway', status: 'Authorised' },
  ];

  test('Returns the status in the region', () => {
    expect(getRegionStatus(statuses, ApprovalRegion.Norway)).toBe('Authorised');
    expect(getRegionStatus(statuses, ApprovalRegion.Eea)).toBe('Ended');
  });

  test('Returns undefined when the region has no status', () => {
    expect(getRegionStatus([], ApprovalRegion.Norway)).toBeUndefined();
  });
});

describe('getInvestigatorName()', () => {
  test('Returns the title and the full name', () => {
    expect(getInvestigatorName({ type: 'Investigator', title: 'Prof.', firstName: 'Kari', lastName: 'Nordmann' })).toBe(
      'Prof. Kari Nordmann'
    );
  });

  test('Leaves out missing parts of the name', () => {
    expect(getInvestigatorName({ type: 'Investigator', firstName: 'Kari', lastName: 'Nordmann' })).toBe(
      'Kari Nordmann'
    );
    expect(getInvestigatorName(undefined)).toBe('');
  });
});

describe('getTrialSiteAffiliation()', () => {
  test('Returns the organization and the department of the investigator', () => {
    expect(
      getTrialSiteAffiliation({
        type: 'TrialSite',
        departmentName: 'Helse Bergen HF',
        investigator: { type: 'Investigator', department: 'Oncology' },
      })
    ).toBe('Helse Bergen HF, Oncology');
  });

  test('Leaves out a missing department', () => {
    expect(getTrialSiteAffiliation({ type: 'TrialSite', departmentName: 'Helse Bergen HF' })).toBe('Helse Bergen HF');
  });
});
