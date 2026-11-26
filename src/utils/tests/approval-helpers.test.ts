import { describe, expect, test } from 'vitest';
import { Approval, ApprovalIdentifier } from '../../types/approval.types';
import {
  getApprovalIdentifier,
  getApprovalViewUrl,
  getApprovedApprovals,
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

  test('Uses the first REK or DMP identifier in the order the approval API returns them', () => {
    const approval = makeApproval('a', [unsupportedIdentifier, dmpIdentifier, rekIdentifier]);

    expect(toNewProjectApproval(approval, today)).toMatchObject({
      authority: 'NorwegianMedicinesAgency',
      identifier: '2024-512733-32-00',
    });
  });

  test('Returns null when the approval has no REK or DMP identifier', () => {
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

  test('Returns null when the authority is not REK or DMP', () => {
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

describe('getApprovalViewUrl()', () => {
  test('Returns the view URL on the API host for the identifier of the approval', () => {
    expect(
      getApprovalViewUrl(
        'https://api.dev.nva.aws.unit.no/approval/b62513c0-42b5-4e6f-a856-c4f234e6afb3',
        'https://api.dev.nva.aws.unit.no/'
      )
    ).toBe('https://api.dev.nva.aws.unit.no/approval/b62513c0-42b5-4e6f-a856-c4f234e6afb3/view');
  });

  test('Uses the given API host, not the host of the approval id', () => {
    expect(getApprovalViewUrl('https://api.nva.unit.no/approval/abc', 'https://api.test.nva.aws.unit.no/')).toBe(
      'https://api.test.nva.aws.unit.no/approval/abc/view'
    );
  });
});
