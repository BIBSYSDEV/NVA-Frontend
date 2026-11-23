import { describe, expect, test } from 'vitest';
import { Approval, ApprovalIdentifier } from '../../types/approval.types';
import {
  findApprovalWithIdentifier,
  getApprovalIdentifier,
  getApprovedApprovals,
  isSupportedApproval,
  toNewProjectApproval,
} from '../approval-helpers';

const makeApproval = (id: string, identifiers: Pick<ApprovalIdentifier, 'name' | 'value'>[]): Approval => ({
  type: 'Approval',
  id,
  handle: `https://hdl.handle.net/${id}`,
  title: `Approval ${id}`,
  identifiers: identifiers.map((identifier) => ({ type: 'Identifier', ...identifier })),
});

const rekIdentifier = { name: 'REK', value: '123456' };
const dmpIdentifier = { name: 'DMP', value: '2024-512733-32-00' };
const unsupportedIdentifier = { name: 'Unknown', value: '987' };

describe('isSupportedApproval()', () => {
  test('Returns true when the approval has a REK or DMP identifier', () => {
    expect(isSupportedApproval(makeApproval('a', [rekIdentifier]))).toBe(true);
    expect(isSupportedApproval(makeApproval('b', [dmpIdentifier]))).toBe(true);
  });

  test('Returns true when one of several identifiers is supported', () => {
    expect(isSupportedApproval(makeApproval('a', [unsupportedIdentifier, rekIdentifier]))).toBe(true);
  });

  test('Returns false when the approval has no supported identifier', () => {
    expect(isSupportedApproval(makeApproval('a', [unsupportedIdentifier]))).toBe(false);
  });
});

describe('toNewProjectApproval()', () => {
  const today = new Date('2026-11-19T12:00:00.000Z');

  test('Creates an ethical approval from the Regional Ethical Committees for a REK identifier', () => {
    expect(toNewProjectApproval(makeApproval('a', [rekIdentifier]), today)).toEqual({
      type: 'Approval',
      date: '2026-11-19T12:00:00.000Z',
      authority: 'RegionalEthicalCommittees',
      applicationCode: 'EthicalApproval',
      status: 'Approved',
      identifier: '123456',
    });
  });

  test('Creates a drug trial approval from the Norwegian Medicines Agency for a DMP identifier', () => {
    expect(toNewProjectApproval(makeApproval('a', [dmpIdentifier]), today)).toEqual({
      type: 'Approval',
      date: '2026-11-19T12:00:00.000Z',
      authority: 'NorwegianMedicinesAgency',
      applicationCode: 'DrugTrial',
      status: 'Approved',
      identifier: '2024-512733-32-00',
    });
  });

  test('Uses the first supported identifier when the approval has several', () => {
    const approval = makeApproval('a', [unsupportedIdentifier, dmpIdentifier, rekIdentifier]);

    expect(toNewProjectApproval(approval, today)).toMatchObject({
      authority: 'NorwegianMedicinesAgency',
      identifier: '2024-512733-32-00',
    });
  });

  test('Returns null when the approval has no supported identifier', () => {
    expect(toNewProjectApproval(makeApproval('a', [unsupportedIdentifier]), today)).toBeNull();
  });
});

describe('getApprovalIdentifier()', () => {
  test('Returns the identifier name of the authority together with the identifier value', () => {
    expect(getApprovalIdentifier({ authority: 'RegionalEthicalCommittees', identifier: '123456' })).toEqual({
      name: 'REK',
      value: '123456',
    });
    expect(getApprovalIdentifier({ authority: 'NorwegianMedicinesAgency', identifier: '2024-1' })).toEqual({
      name: 'DMP',
      value: '2024-1',
    });
  });

  test('Returns null when the authority is not a supported source', () => {
    expect(getApprovalIdentifier({ authority: 'NorwegianDataProtectionAuthority', identifier: '123' })).toBeNull();
  });

  test('Returns null when the identifier is empty', () => {
    expect(getApprovalIdentifier({ authority: 'RegionalEthicalCommittees', identifier: '' })).toBeNull();
  });
});

describe('getApprovedApprovals()', () => {
  test('Returns only the approvals with status Approved', () => {
    const approved = { status: 'Approved' as const, identifier: '1' };
    const rejected = { status: 'Rejected' as const, identifier: '2' };

    expect(getApprovedApprovals([approved, rejected])).toEqual([approved]);
  });

  test('Returns an empty list when there are no approvals', () => {
    expect(getApprovedApprovals(undefined)).toEqual([]);
  });
});

describe('findApprovalWithIdentifier()', () => {
  test('Returns the approval with an identifier matching both name and value', () => {
    const approvals = [makeApproval('a', [dmpIdentifier]), makeApproval('b', [rekIdentifier])];

    expect(findApprovalWithIdentifier(approvals, rekIdentifier)?.id).toBe('b');
  });

  test('Ignores identifiers with the same value but another name', () => {
    const approvals = [makeApproval('a', [{ name: 'DMP', value: '123456' }]), makeApproval('b', [rekIdentifier])];

    expect(findApprovalWithIdentifier(approvals, rekIdentifier)?.id).toBe('b');
  });

  test('Returns null when no identifier matches exactly', () => {
    const approvals = [makeApproval('a', [{ name: 'REK', value: '1234567' }])];

    expect(findApprovalWithIdentifier(approvals, rekIdentifier)).toBeNull();
  });
});
