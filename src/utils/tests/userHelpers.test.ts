import { describe, expect, it } from 'vitest';
import {
  checkIfPersonHasNationalIdentificationNumber,
  findFirstEmploymentThatMatchesAnActiveAffiliation,
  getEmployments,
  sanitizeRolesForEmbargoConstraint,
} from '../user-helpers';
import { RoleName, UserRole } from '../../types/user.types';
import { buildAffiliation, buildCristinPerson, buildEmployment } from './testHelpers';

describe('getEmployments', () => {
  const topOrgCristinId = '123.0.0.0';

  const internalEmployment = buildEmployment({
    organization: `org/${topOrgCristinId}`,
  });

  const externalEmployment = buildEmployment({
    organization: 'org/456.0.0.0',
  });

  it('returns internal employments', () => {
    const person = buildCristinPerson({
      employments: [internalEmployment],
    });

    const result = getEmployments(person, topOrgCristinId);
    expect(result.internalEmployments).toEqual([internalEmployment]);
    expect(result.externalEmployments).toEqual([]);
  });

  it('returns external employments', () => {
    const person = buildCristinPerson({
      employments: [externalEmployment],
    });
    const result = getEmployments(person, topOrgCristinId);
    expect(result.internalEmployments).toEqual([]);
    expect(result.externalEmployments).toEqual([externalEmployment]);
  });

  it('returns both internal and external employments', () => {
    const person = buildCristinPerson({
      employments: [internalEmployment, externalEmployment],
    });
    const result = getEmployments(person, topOrgCristinId);
    expect(result.internalEmployments).toEqual([internalEmployment]);
    expect(result.externalEmployments).toEqual([externalEmployment]);
  });

  it('returns empty arrays if no employments', () => {
    const person = buildCristinPerson();
    const result = getEmployments(person, topOrgCristinId);
    expect(result.internalEmployments).toEqual([]);
    expect(result.externalEmployments).toEqual([]);
  });

  it('handles undefined cristinPerson', () => {
    const result = getEmployments(undefined, topOrgCristinId);
    expect(result.internalEmployments).toEqual([]);
    expect(result.externalEmployments).toEqual([]);
  });

  it('handles undefined topOrgCristinId', () => {
    const person = buildCristinPerson({
      employments: [internalEmployment, externalEmployment],
    });
    const result = getEmployments(person, undefined);
    expect(result.internalEmployments).toEqual([]);
    expect(result.externalEmployments).toEqual([internalEmployment, externalEmployment]);
  });
});

describe('checkIfPersonHasNationalIdentificationNumber', () => {
  it('returns true if person has a national identification number', () => {
    const person = buildCristinPerson({
      identifiers: [
        { type: 'NationalIdentificationNumber', value: '12345678901' },
        { type: 'CristinIdentifier', value: 'abc' },
      ],
    });

    expect(checkIfPersonHasNationalIdentificationNumber(person)).toBe(true);
  });

  it('returns false if person does not have a national identification number', () => {
    const person = buildCristinPerson({ identifiers: [{ type: 'CristinIdentifier', value: 'abc' }] });
    expect(checkIfPersonHasNationalIdentificationNumber(person)).toBe(false);
  });

  it('returns false if national identification number value is empty', () => {
    const person = buildCristinPerson({ identifiers: [{ type: 'NationalIdentificationNumber', value: '' }] });
    expect(checkIfPersonHasNationalIdentificationNumber(person)).toBe(false);
  });

  it('returns false if identifiers array is empty', () => {
    const person = buildCristinPerson();
    expect(checkIfPersonHasNationalIdentificationNumber(person)).toBe(false);
  });
});

describe('findFirstEmploymentThatMatchesAnActiveAffiliation', () => {
  const employment1 = buildEmployment({
    organization: 'org/123',
  });

  const employment2 = buildEmployment({
    organization: 'org/456',
  });

  const activeAffiliationWithOrg1 = buildAffiliation({ organization: 'org/123', active: true });
  const activeAffiliationWithOrg3 = buildAffiliation({ organization: 'org/789', active: true });
  const inactiveAffiliationWithOrg2 = buildAffiliation({ organization: 'org/456', active: false });

  it('returns the first employment that matches an active affiliation', () => {
    const result = findFirstEmploymentThatMatchesAnActiveAffiliation(
      [employment1, employment2],
      [activeAffiliationWithOrg1, activeAffiliationWithOrg3]
    );
    expect(result).toEqual(employment1);
  });

  it('returns undefined if no employment matches an active affiliation', () => {
    const result = findFirstEmploymentThatMatchesAnActiveAffiliation([employment2], [activeAffiliationWithOrg3]);
    expect(result).toBeUndefined();
  });

  it('ignores inactive affiliations', () => {
    const result = findFirstEmploymentThatMatchesAnActiveAffiliation([employment2], [inactiveAffiliationWithOrg2]);
    expect(result).toBeUndefined();
  });

  it('returns undefined if employments is empty', () => {
    const result = findFirstEmploymentThatMatchesAnActiveAffiliation([], [activeAffiliationWithOrg1]);
    expect(result).toBeUndefined();
  });

  it('returns undefined if affiliations is empty', () => {
    const result = findFirstEmploymentThatMatchesAnActiveAffiliation([employment1], []);
    expect(result).toBeUndefined();
  });
});

describe('sanitizeRolesForEmbargoConstraint', () => {
  it('removes CuratorThesisEmbargo if CuratorThesis is NOT present', () => {
    const roles: UserRole[] = [
      { type: 'Role', rolename: RoleName.CuratorThesisEmbargo },
      { type: 'Role', rolename: RoleName.NviCurator },
    ];
    const result = sanitizeRolesForEmbargoConstraint(roles);
    expect(result).toEqual([{ type: 'Role', rolename: RoleName.NviCurator }]);
  });

  it('returns roles unchanged if CuratorThesis is present', () => {
    const roles: UserRole[] = [
      { type: 'Role', rolename: RoleName.CuratorThesis },
      { type: 'Role', rolename: RoleName.CuratorThesisEmbargo },
    ];
    const result = sanitizeRolesForEmbargoConstraint(roles);
    expect(result).toEqual(roles);
  });

  it('returns roles unchanged if CuratorThesisEmbargo is not present', () => {
    const roles: UserRole[] = [{ type: 'Role', rolename: RoleName.NviCurator }];
    const result = sanitizeRolesForEmbargoConstraint(roles);
    expect(result).toEqual(roles);
  });

  it('returns empty array if only CuratorThesisEmbargo is present', () => {
    const roles: UserRole[] = [{ type: 'Role', rolename: RoleName.CuratorThesisEmbargo }];
    const result = sanitizeRolesForEmbargoConstraint(roles);
    expect(result).toEqual([]);
  });
});
