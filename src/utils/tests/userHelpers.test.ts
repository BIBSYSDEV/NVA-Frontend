import { describe, expect, it } from 'vitest';
import {
  checkIfPersonHasNationalIdentificationNumber,
  findFirstEmploymentThatMatchesAnActiveAffiliation,
  getEmployments,
  sanitizeRolesForEmbargoConstraint,
} from '../user-helpers';
import { CristinPerson, CristinPersonAffiliation, Employment, RoleName, UserRole } from '../../types/user.types';

describe('getEmployments', () => {
  const topOrgCristinId = '123.0.0.0';

  const internalOrg = 'org/123.0.0.0'; // matches expected prefix
  const externalOrg = 'org/456.0.0.0';

  const internalEmployment: Employment = {
    type: 'Temporary',
    organization: internalOrg,
    startDate: '2020-01-01',
    endDate: '',
    fullTimeEquivalentPercentage: '100',
  };

  const externalEmployment: Employment = {
    type: 'Temporary',
    organization: externalOrg,
    startDate: '2021-01-01',
    endDate: '',
    fullTimeEquivalentPercentage: '100',
  };

  it('returns internal employments', () => {
    const person: CristinPerson = {
      employments: [internalEmployment],
      affiliations: [],
      identifiers: [],
      names: [],
      id: '',
      background: {},
      keywords: [],
      nvi: undefined,
    };
    const result = getEmployments(person, topOrgCristinId);
    expect(result.internalEmployments).toEqual([internalEmployment]);
    expect(result.externalEmployments).toEqual([]);
  });

  it('returns external employments', () => {
    const person: CristinPerson = {
      employments: [externalEmployment],
      affiliations: [],
      identifiers: [],
      names: [],
      id: '',
      background: {},
      keywords: [],
      nvi: undefined,
    };
    const result = getEmployments(person, topOrgCristinId);
    expect(result.internalEmployments).toEqual([]);
    expect(result.externalEmployments).toEqual([externalEmployment]);
  });

  it('returns both internal and external employments', () => {
    const person: CristinPerson = {
      employments: [internalEmployment, externalEmployment],
      affiliations: [],
      identifiers: [],
      names: [],
      id: '',
      background: {},
      keywords: [],
      nvi: undefined,
    };
    const result = getEmployments(person, topOrgCristinId);
    expect(result.internalEmployments).toEqual([internalEmployment]);
    expect(result.externalEmployments).toEqual([externalEmployment]);
  });

  it('returns empty arrays if no employments', () => {
    const person: CristinPerson = {
      employments: [],
      affiliations: [],
      identifiers: [],
      names: [],
      id: '',
      background: {},
      keywords: [],
      nvi: undefined,
    };
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
    const person: CristinPerson = {
      employments: [internalEmployment, externalEmployment],
      affiliations: [],
      identifiers: [],
      names: [],
      id: '',
      background: {},
      keywords: [],
      nvi: undefined,
    };
    const result = getEmployments(person, undefined);
    expect(result.internalEmployments).toEqual([]);
    expect(result.externalEmployments).toEqual([internalEmployment, externalEmployment]);
  });
});

describe('checkIfPersonHasNationalIdentificationNumber', () => {
  it('returns true if person has a national identification number', () => {
    const person: CristinPerson = {
      identifiers: [
        { type: 'NationalIdentificationNumber', value: '12345678901' },
        { type: 'CristinIdentifier', value: 'abc' },
      ],
      names: [],
      employments: [],
      affiliations: [],
      id: '',
      background: {},
      keywords: [],
      nvi: undefined,
    };
    expect(checkIfPersonHasNationalIdentificationNumber(person)).toBe(true);
  });

  it('returns false if person does not have a national identification number', () => {
    const person: CristinPerson = {
      identifiers: [{ type: 'CristinIdentifier', value: 'abc' }],
      names: [],
      employments: [],
      affiliations: [],
      id: '',
      background: {},
      keywords: [],
      nvi: undefined,
    };
    expect(checkIfPersonHasNationalIdentificationNumber(person)).toBe(false);
  });

  it('returns false if national identification number value is empty', () => {
    const person: CristinPerson = {
      identifiers: [{ type: 'NationalIdentificationNumber', value: '' }],
      names: [],
      employments: [],
      affiliations: [],
      id: '',
      background: {},
      keywords: [],
      nvi: undefined,
    };
    expect(checkIfPersonHasNationalIdentificationNumber(person)).toBe(false);
  });

  it('returns false if identifiers array is empty', () => {
    const person: CristinPerson = {
      identifiers: [],
      names: [],
      employments: [],
      affiliations: [],
      id: '',
      background: {},
      keywords: [],
      nvi: undefined,
    };
    expect(checkIfPersonHasNationalIdentificationNumber(person)).toBe(false);
  });
});

describe('findFirstEmploymentThatMatchesAnActiveAffiliation', () => {
  const employment1: Employment = {
    type: 'Temporary',
    organization: 'org/123',
    startDate: '2020-01-01',
    endDate: '',
    fullTimeEquivalentPercentage: '100',
  };
  const employment2: Employment = {
    type: 'Temporary',
    organization: 'org/456',
    startDate: '2021-01-01',
    endDate: '',
    fullTimeEquivalentPercentage: '100',
  };

  const affiliation1: CristinPersonAffiliation = {
    organization: 'org/123',
    active: true,
    role: {
      labels: { no: 'Ansatt', en: 'Employee' },
    },
  };
  const affiliation2: CristinPersonAffiliation = {
    organization: 'org/789',
    active: true,
    role: {
      labels: { no: 'Ansatt', en: 'Employee' },
    },
  };
  const inactiveAffiliation: CristinPersonAffiliation = {
    organization: 'org/456',
    active: false,
    role: {
      labels: { no: 'Ansatt', en: 'Employee' },
    },
  };

  it('returns the first employment that matches an active affiliation', () => {
    const result = findFirstEmploymentThatMatchesAnActiveAffiliation(
      [employment1, employment2],
      [affiliation1, affiliation2]
    );
    expect(result).toEqual(employment1);
  });

  it('returns undefined if no employment matches an active affiliation', () => {
    const result = findFirstEmploymentThatMatchesAnActiveAffiliation([employment2], [affiliation2]);
    expect(result).toBeUndefined();
  });

  it('ignores inactive affiliations', () => {
    const result = findFirstEmploymentThatMatchesAnActiveAffiliation([employment2], [inactiveAffiliation]);
    expect(result).toBeUndefined();
  });

  it('returns undefined if employments is empty', () => {
    const result = findFirstEmploymentThatMatchesAnActiveAffiliation([], [affiliation1]);
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
