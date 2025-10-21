import { CristinPerson, CristinPersonAffiliation, Employment } from '../../types/user.types';

export const buildCristinPerson = (overrides: Partial<CristinPerson> = {}): CristinPerson => ({
  id: '',
  affiliations: [],
  employments: [],
  background: {},
  identifiers: [],
  names: [],
  ...overrides,
});

export const buildEmployment = (overrides: Partial<Employment> = {}): Employment => ({
  type: '',
  organization: '',
  startDate: '',
  endDate: '',
  fullTimeEquivalentPercentage: '',
  ...overrides,
});

export const buildAffiliation = (overrides: Partial<CristinPersonAffiliation> = {}): CristinPersonAffiliation => ({
  active: true,
  organization: '',
  role: {
    labels: { no: 'Ansatt', en: 'Employee' },
  },
  ...overrides,
});
