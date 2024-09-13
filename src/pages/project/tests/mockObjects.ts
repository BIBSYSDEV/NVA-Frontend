import { ProjectContributor, ProjectContributorIdentity, ProjectOrganization } from '../../../types/project.types';
import { CristinPerson } from '../../../types/user.types';

export const selectedPersonWithAffiliation: CristinPerson = {
  id: '123',
  affiliations: [
    {
      active: true,
      organization: 'abcorg',
      role: {
        labels: { no: 'no' },
      },
    },
  ],
  employments: [
    {
      type: 'a',
      organization: 'b',
      startDate: 'c',
      endDate: 'd',
      fullTimeEquivalentPercentage: 'e',
    },
  ],
  background: {
    no: 'no',
    en: 'eng',
  },
  identifiers: [{ type: 'CristinIdentifier', value: '123' }],
  names: [
    { type: 'FirstName', value: 'Navn' },
    { type: 'LastName', value: 'Navnesen' },
  ],
};

export const selectedPersonWithoutAffiliation: CristinPerson = {
  ...selectedPersonWithAffiliation,
  affiliations: [],
};

export const selectedPersonIdentity: ProjectContributorIdentity = {
  firstName: 'Navn',
  id: '123',
  lastName: 'Navnesen',
  type: 'Person',
};

export const existingPersonIdentity: ProjectContributorIdentity = {
  firstName: 'Ole',
  id: '456',
  lastName: 'Jensen',
  type: 'Person',
};

export const abcOrgAsAffiliation: ProjectOrganization = {
  id: 'abcorg',
  labels: {},
  type: 'Organization',
};

export const defOrgAsAffiliation: ProjectOrganization = {
  id: 'deforg',
  labels: {},
  type: 'Organization',
};

export const contributorsArrayWithProjectManager: ProjectContributor[] = [
  { identity: existingPersonIdentity, roles: [{ type: 'ProjectManager', affiliation: defOrgAsAffiliation }] },
];
