import { describe, expect, test } from 'vitest';
import { Approval } from '../../types/approval.types';
import { findApprovalWithIdentifier } from '../approval-helpers';

const makeApproval = (id: string, identifierValues: string[]): Approval => ({
  type: 'Approval',
  id,
  handle: `https://hdl.handle.net/${id}`,
  title: `Approval ${id}`,
  identifiers: identifierValues.map((value) => ({ type: 'Identifier', name: 'DMP', value })),
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
