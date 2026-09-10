import { Contributor, ContributorRole, Identity } from '../../types/contributor.types';
import { CristinPerson, CristinPersonAffiliation, Employment } from '../../types/user.types';

export const buildIdentity = (overrides: Partial<Identity> = {}): Identity => ({
  type: 'Identity',
  name: '',
  ...overrides,
});

export const buildContributor = (overrides: Partial<Contributor> = {}): Contributor => ({
  type: 'Contributor',
  affiliations: [],
  correspondingAuthor: false,
  identity: buildIdentity(),
  role: { type: ContributorRole.Creator },
  sequence: 1,
  ...overrides,
});

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
