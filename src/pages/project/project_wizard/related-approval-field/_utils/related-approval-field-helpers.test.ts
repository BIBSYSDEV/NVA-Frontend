import { describe, expect, test } from 'vitest';
import { createFallbackApproval } from './related-approval-field-helpers';

describe('createFallbackApproval()', () => {
  test('Uses the identifier name and value as title for a supported authority', () => {
    const approval = createFallbackApproval({ authority: 'NorwegianMedicinesAgency', identifier: '2024-512733-32-00' });

    expect(approval.title).toBe('DMP: 2024-512733-32-00');
    expect(approval.identifiers).toEqual([{ type: 'Identifier', name: 'DMP', value: '2024-512733-32-00' }]);
  });

  test('Uses only the identifier as title when the authority is not supported', () => {
    const approval = createFallbackApproval({ authority: 'NorwegianDataProtectionAuthority', identifier: '2020/1' });

    expect(approval.title).toBe('2020/1');
    expect(approval.identifiers).toEqual([]);
  });
});
