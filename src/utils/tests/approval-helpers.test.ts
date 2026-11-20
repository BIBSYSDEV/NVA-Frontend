import { describe, expect, test } from 'vitest';
import { Approval } from '../../types/approval.types';
import { findApprovalWithIdentifier, toNewProjectApproval } from '../approval-helpers';

const makeApproval = (id: string, identifierValues: string[], identifierName = 'DMP'): Approval => ({
  type: 'Approval',
  id,
  handle: `https://hdl.handle.net/${id}`,
  title: `Approval ${id}`,
  identifiers: identifierValues.map((value) => ({ type: 'Identifier', name: identifierName, value })),
});

describe('findApprovalWithIdentifier()', () => {
  test('Returns the approval with an identifier matching the value', () => {
    const approvals = [makeApproval('a', ['2024-1']), makeApproval('b', ['2024-2'])];

    expect(findApprovalWithIdentifier(approvals, '2024-2')?.id).toBe('b');
  });

  test('Matches any of the identifiers of an approval', () => {
    const approvals = [makeApproval('a', ['2024-1', '2024-3'])];

    expect(findApprovalWithIdentifier(approvals, '2024-3')?.id).toBe('a');
  });

  test('Returns null when no identifier matches exactly', () => {
    const approvals = [makeApproval('a', ['2024-10'])];

    expect(findApprovalWithIdentifier(approvals, '2024-1')).toBeNull();
  });
});

describe('toNewProjectApproval()', () => {
  const today = new Date('2026-11-19T12:00:00.000Z');

  test('Uses the DMP number as identifier of an approved drug trial from the Norwegian Medicines Agency', () => {
    expect(toNewProjectApproval(makeApproval('a', ['2024-512733-32-00']), today)).toEqual({
      type: 'Approval',
      date: '2026-11-19T12:00:00.000Z',
      authority: 'NorwegianMedicinesAgency',
      applicationCode: 'DrugTrial',
      status: 'Approved',
      identifier: '2024-512733-32-00',
    });
  });

  test('Returns null when the approval has no DMP number', () => {
    expect(toNewProjectApproval(makeApproval('a', ['2024/123'], 'REK'), today)).toBeNull();
  });
});
