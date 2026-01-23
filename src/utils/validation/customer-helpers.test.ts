import { describe, expect, it } from 'vitest';
import { SimpleCustomerInstitution } from '../../types/customerInstitution.types';
import { someAffiliationIsNviCustomer } from '../customer-helpers';

describe('someAffiliationIsNviCustomer', () => {
  const nviCustomer: SimpleCustomerInstitution = { cristinId: '123', name: 'NVI', nviInstitution: true } as any;
  const nonNviCustomer: SimpleCustomerInstitution = { cristinId: '456', name: 'Non-NVI', nviInstitution: false } as any;
  const customerWithoutNviInfo: SimpleCustomerInstitution = { cristinId: '789', name: 'Non-NVI' } as any;
  const customerMap = new Map<string, SimpleCustomerInstitution>([
    ['123', nviCustomer],
    ['456', nonNviCustomer],
    ['789', customerWithoutNviInfo],
  ]);

  it('returns true if an affiliation id matches a customer with nviInstitution true', () => {
    const affiliations = [{ id: '123' }, { id: '101' }] as any;
    expect(someAffiliationIsNviCustomer(affiliations, customerMap)).toBe(true);
  });

  it('returns false if no affiliation id matches a customer with nviInstitution true', () => {
    const affiliations = [{ id: '222' }, { id: '456' }, { id: '789' }] as any;
    expect(someAffiliationIsNviCustomer(affiliations, customerMap)).toBe(false);
  });

  it('returns false if no affiliation id is in the map', () => {
    const affiliations = [{ id: '333' }, { id: '444' }] as any;
    expect(someAffiliationIsNviCustomer(affiliations, customerMap)).toBe(false);
  });

  it('returns false if affiliations have no id property', () => {
    const affiliations = [{ name: 'No id' }] as any;
    expect(someAffiliationIsNviCustomer(affiliations, customerMap)).toBe(false);
  });

  it('handles mixed affiliations with and without id', () => {
    const affiliations = [{ name: 'No id' }, { id: '123' }] as any;
    expect(someAffiliationIsNviCustomer(affiliations, customerMap)).toBe(true);
  });

  it('returns false for empty affiliations', () => {
    expect(someAffiliationIsNviCustomer([], customerMap)).toBe(false);
  });

  it('returns false for undefined affiliations', () => {
    expect(someAffiliationIsNviCustomer(undefined, customerMap)).toBe(false);
  });
});
