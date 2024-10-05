import {
  ProjectContributor,
  ProjectContributorIdentity,
  ProjectContributorRole,
  ProjectOrganization,
} from '../../../types/project.types';
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

export const selectedPersonWithManyAffiliations = {
  ...selectedPersonWithAffiliation,
  affiliations: [
    {
      active: true,
      organization: 'abcorg',
      role: {
        labels: { no: 'no' },
      },
    },
    {
      active: true,
      organization: 'deforg',
      role: {
        labels: { no: 'no' },
      },
    },
    {
      active: true,
      organization: 'ghiorg',
      role: {
        labels: { no: 'no' },
      },
    },
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

export const unidentifiedDaffyIdentity: ProjectContributorIdentity = {
  firstName: 'Daffy',
  lastName: 'Duck',
  type: 'Person',
};

export const unidentifiedOleJensenIdentity: ProjectContributorIdentity = {
  firstName: 'Ole',
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

export const ghiOrgAsAffiliation: ProjectOrganization = {
  id: 'ghiorg',
  labels: {},
  type: 'Organization',
};

export const jklOrgAsAffiliation: ProjectOrganization = {
  id: 'jklorg',
  labels: {},
  type: 'Organization',
};

export const contributorsArrayWithProjectManager: ProjectContributor[] = [
  { identity: existingPersonIdentity, roles: [{ type: 'ProjectManager', affiliation: defOrgAsAffiliation }] },
];

export const contributorsArrayWithProjectManagerWithoutAffiliation: ProjectContributor[] = [
  { identity: existingPersonIdentity, roles: [{ type: 'ProjectManager', affiliation: undefined }] },
];

export const contributorsArrayWithUnidentifiedProjectManagerWithSameAffiliation: ProjectContributor[] = [
  { identity: unidentifiedDaffyIdentity, roles: [{ type: 'ProjectManager', affiliation: abcOrgAsAffiliation }] },
];

export const contributorsArrayWithSelectedPersonAsProjectManagerWithSameAffiliation: ProjectContributor[] = [
  { identity: selectedPersonIdentity, roles: [{ type: 'ProjectManager', affiliation: abcOrgAsAffiliation }] },
];

export const contributorsArrayWithSelectedPersonAsProjectManagerWithDifferentAffiliation: ProjectContributor[] = [
  { identity: selectedPersonIdentity, roles: [{ type: 'ProjectManager', affiliation: defOrgAsAffiliation }] },
];

export const contributorsArrayWithSelectedPersonAsProjectManagerWithNoAffiliation: ProjectContributor[] = [
  { identity: selectedPersonIdentity, roles: [{ type: 'ProjectManager', affiliation: undefined }] },
];

export const contributorsArrayWithDifferentProjectManagerWithSameAffiliation: ProjectContributor[] = [
  { identity: existingPersonIdentity, roles: [{ type: 'ProjectManager', affiliation: abcOrgAsAffiliation }] },
];

export const contributorsArrayWithDifferentProjectManagerWithDifferentAffiliation: ProjectContributor[] = [
  { identity: existingPersonIdentity, roles: [{ type: 'ProjectManager', affiliation: defOrgAsAffiliation }] },
];

export const contributorsArrayWithUnidentifiedProjectManagerWithDifferentAffiliation: ProjectContributor[] = [
  { identity: unidentifiedDaffyIdentity, roles: [{ type: 'ProjectManager', affiliation: defOrgAsAffiliation }] },
];

export const contributorsArrayWithDifferentProjectManagerWithUndefinedAffiliation: ProjectContributor[] = [
  { identity: existingPersonIdentity, roles: [{ type: 'ProjectManager', affiliation: undefined }] },
];

export const contributorsArrayWithUnidentifiedProjectManagerWithUndefinedAffiliation: ProjectContributor[] = [
  { identity: unidentifiedDaffyIdentity, roles: [{ type: 'ProjectManager', affiliation: undefined }] },
];

export const contributorsArrayWithSelectedPersonWithSameAffiliation: ProjectContributor[] = [
  { identity: selectedPersonIdentity, roles: [{ type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation }] },
];

export const contributorsArrayWithSelectedPersonWithDifferentAffiliation: ProjectContributor[] = [
  { identity: selectedPersonIdentity, roles: [{ type: 'ProjectParticipant', affiliation: defOrgAsAffiliation }] },
];

export const contributorsArrayWithUnidentifiedPersonWithUndefinedAffiliationAndSelectedWithOther: ProjectContributor[] =
  [
    { identity: unidentifiedDaffyIdentity, roles: [{ type: 'ProjectManager', affiliation: undefined }] },
    { identity: selectedPersonIdentity, roles: [{ type: 'ProjectParticipant', affiliation: defOrgAsAffiliation }] },
  ];

export const contributorsArrayWithTwoUnidentified: ProjectContributor[] = [
  { identity: unidentifiedDaffyIdentity, roles: [{ type: 'ProjectManager', affiliation: undefined }] },
  {
    identity: unidentifiedOleJensenIdentity,
    roles: [{ type: 'ProjectParticipant', affiliation: defOrgAsAffiliation }],
  },
];

export const contributorsArrayWithUnidentifiedPersonWithUnidentifiedAffiliationAndSelectedWithOther: ProjectContributor[] =
  [
    { identity: unidentifiedDaffyIdentity, roles: [{ type: 'ProjectManager', affiliation: undefined }] },
    { identity: selectedPersonIdentity, roles: [{ type: 'ProjectParticipant', affiliation: defOrgAsAffiliation }] },
  ];

export const contributorsArrayWithUnidentifiedPersonWithUndefinedAffiliationAndSelectedWithTwoOthers: ProjectContributor[] =
  [
    { identity: unidentifiedDaffyIdentity, roles: [{ type: 'ProjectManager', affiliation: undefined }] },
    {
      identity: selectedPersonIdentity,
      roles: [
        { type: 'ProjectParticipant', affiliation: defOrgAsAffiliation },
        { type: 'ProjectParticipant', affiliation: ghiOrgAsAffiliation },
      ],
    },
  ];

export const contributorsArrayWithUnidentifiedAndSamePersonWithUndefined: ProjectContributor[] = [
  { identity: unidentifiedDaffyIdentity, roles: [{ type: 'ProjectManager', affiliation: undefined }] },
  { identity: selectedPersonIdentity, roles: [{ type: 'ProjectParticipant', affiliation: undefined }] },
];

export const contributorsArrayWithUnidentifiedAndOther: ProjectContributor[] = [
  { identity: unidentifiedDaffyIdentity, roles: [{ type: 'ProjectParticipant', affiliation: defOrgAsAffiliation }] },
  { identity: selectedPersonIdentity, roles: [{ type: 'ProjectParticipant', affiliation: ghiOrgAsAffiliation }] },
];

export const contributorsArrayWithOneUnidentifiedAndOneOther: ProjectContributor[] = [
  { identity: unidentifiedDaffyIdentity, roles: [{ type: 'ProjectParticipant', affiliation: defOrgAsAffiliation }] },
  { identity: selectedPersonIdentity, roles: [{ type: 'ProjectParticipant', affiliation: ghiOrgAsAffiliation }] },
];

export const contributorsArrayWithOneUnidentifiedWithSameAndOneOther: ProjectContributor[] = [
  { identity: unidentifiedDaffyIdentity, roles: [{ type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation }] },
  { identity: selectedPersonIdentity, roles: [{ type: 'ProjectParticipant', affiliation: ghiOrgAsAffiliation }] },
];

export const contributorsArrayWithOneUnidentifiedWithUndefinedAndOneOther: ProjectContributor[] = [
  { identity: unidentifiedDaffyIdentity, roles: [{ type: 'ProjectParticipant', affiliation: undefined }] },
  { identity: selectedPersonIdentity, roles: [{ type: 'ProjectParticipant', affiliation: ghiOrgAsAffiliation }] },
];

export const contributorsArrayWithOneUnidentifiedWithUndefinedAndOneOtherWithUndefined: ProjectContributor[] = [
  { identity: unidentifiedDaffyIdentity, roles: [{ type: 'ProjectParticipant', affiliation: undefined }] },
  { identity: selectedPersonIdentity, roles: [{ type: 'ProjectParticipant', affiliation: undefined }] },
];

export const contributorsArrayWithOneUnidentifiedWithSameAndOneOtherWithUndefined: ProjectContributor[] = [
  { identity: unidentifiedDaffyIdentity, roles: [{ type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation }] },
  { identity: selectedPersonIdentity, roles: [{ type: 'ProjectParticipant', affiliation: undefined }] },
];

export const contributorsArrayWithOneUnidentifiedAndOneOtherWithUndefined: ProjectContributor[] = [
  { identity: unidentifiedDaffyIdentity, roles: [{ type: 'ProjectParticipant', affiliation: defOrgAsAffiliation }] },
  { identity: selectedPersonIdentity, roles: [{ type: 'ProjectParticipant', affiliation: undefined }] },
];

export const contributorsArrayWithSelectedPersonWithUndefinedAffiliation: ProjectContributor[] = [
  { identity: selectedPersonIdentity, roles: [{ type: 'ProjectParticipant', affiliation: undefined }] },
];
export const contributorsArrayWithOtherPersonWithSameAffiliation: ProjectContributor[] = [
  { identity: existingPersonIdentity, roles: [{ type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation }] },
];

export const contributorsArrayWithOtherPersonWithDifferentAffiliation: ProjectContributor[] = [
  { identity: existingPersonIdentity, roles: [{ type: 'ProjectParticipant', affiliation: defOrgAsAffiliation }] },
];

export const contributorsArrayWithOtherPersonWithUndefinedAffiliation: ProjectContributor[] = [
  { identity: existingPersonIdentity, roles: [{ type: 'ProjectParticipant', affiliation: undefined }] },
];

export const contributorsArrayWithContributorWithBothPMRoleAndParticipantRole: ProjectContributor[] = [
  {
    identity: selectedPersonIdentity,
    roles: [
      { type: 'ProjectManager', affiliation: abcOrgAsAffiliation },
      { type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation },
      { type: 'ProjectParticipant', affiliation: defOrgAsAffiliation },
    ],
  },
  {
    identity: existingPersonIdentity,
    roles: [
      { type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation },
      { type: 'ProjectParticipant', affiliation: defOrgAsAffiliation },
    ],
  },
];

export const contributorsArrayWithContributorsWithOnlyParticipantRole: ProjectContributor[] = [
  {
    identity: selectedPersonIdentity,
    roles: [
      { type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation },
      { type: 'ProjectParticipant', affiliation: defOrgAsAffiliation },
    ],
  },
  {
    identity: existingPersonIdentity,
    roles: [
      { type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation },
      { type: 'ProjectParticipant', affiliation: defOrgAsAffiliation },
    ],
  },
];

export const contributorsArrayWithContributorsWithOnlyManagerRole: ProjectContributor[] = [
  {
    identity: selectedPersonIdentity,
    roles: [{ type: 'ProjectManager', affiliation: abcOrgAsAffiliation }],
  },
  {
    identity: existingPersonIdentity,
    roles: [
      { type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation },
      { type: 'ProjectParticipant', affiliation: defOrgAsAffiliation },
    ],
  },
];

export const contributorsArrayWithOtherPMAndUndefinedAffiliation: ProjectContributor[] = [
  {
    identity: existingPersonIdentity,
    roles: [
      { type: 'ProjectManager', affiliation: abcOrgAsAffiliation },
      { type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation },
    ],
  },
  {
    identity: selectedPersonIdentity,
    roles: [{ type: 'ProjectParticipant', affiliation: undefined }],
  },
];

export const contributorsArrayWithUndefinedPMAffiliationAndOtherContributor: ProjectContributor[] = [
  {
    identity: existingPersonIdentity,
    roles: [
      { type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation },
      { type: 'ProjectParticipant', affiliation: defOrgAsAffiliation },
    ],
  },
  {
    identity: selectedPersonIdentity,
    roles: [{ type: 'ProjectManager', affiliation: undefined }],
  },
];

export const contributorsArrayWithNoProjectManager: ProjectContributor[] = [
  {
    identity: existingPersonIdentity,
    roles: [
      { type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation },
      { type: 'ProjectParticipant', affiliation: defOrgAsAffiliation },
    ],
  },
  {
    identity: selectedPersonIdentity,
    roles: [{ type: 'ProjectParticipant', affiliation: undefined }],
  },
];

export const contributorsArrayWithUnidentifiedDaffy: ProjectContributor[] = [
  {
    identity: unidentifiedDaffyIdentity,
    roles: [{ type: 'ProjectParticipant', affiliation: undefined }],
  },
];

export const contributorsArrayWithUnidentifiedDaffyPM: ProjectContributor[] = [
  {
    identity: unidentifiedDaffyIdentity,
    roles: [{ type: 'ProjectManager', affiliation: defOrgAsAffiliation }],
  },
];

export const contributorsArrayWithUnidentifiedDaffyWithSameAffiliation: ProjectContributor[] = [
  {
    identity: unidentifiedDaffyIdentity,
    roles: [{ type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation }],
  },
];

export const contributorsArrayWithUnidentifiedDaffyWithAffiliation: ProjectContributor[] = [
  {
    identity: unidentifiedDaffyIdentity,
    roles: [{ type: 'ProjectParticipant', affiliation: defOrgAsAffiliation }],
  },
];

export const contributorsArrayWithExistingPersonIdentity: ProjectContributor[] = [
  {
    identity: existingPersonIdentity,
    roles: [{ type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation }],
  },
];

export const rolesWithProjectManager: ProjectContributorRole[] = [
  { type: 'ProjectManager', affiliation: abcOrgAsAffiliation },
  { type: 'ProjectParticipant', affiliation: defOrgAsAffiliation },
];

export const rolesWithUndefinedProjectManager: ProjectContributorRole[] = [
  { type: 'ProjectManager', affiliation: undefined },
  { type: 'ProjectParticipant', affiliation: defOrgAsAffiliation },
];

export const rolesWithoutProjectManager: ProjectContributorRole[] = [
  { type: 'ProjectParticipant', affiliation: defOrgAsAffiliation },
];

export const rolesWithDefOrg: ProjectContributorRole[] = [
  { type: 'ProjectParticipant', affiliation: defOrgAsAffiliation },
];

export const rolesWithUndefinedProjectParticipant: ProjectContributorRole[] = [
  { type: 'ProjectManager', affiliation: abcOrgAsAffiliation },
  { type: 'ProjectParticipant', affiliation: undefined },
];

export const severalRolesWithUndefined: ProjectContributorRole[] = [
  { type: 'ProjectManager', affiliation: undefined },
  { type: 'ProjectParticipant', affiliation: undefined },
];

export const rolesWithProjectManagerWithGhiOrg: ProjectContributorRole[] = [
  { type: 'ProjectManager', affiliation: ghiOrgAsAffiliation },
];

export const rolesWithProjectManagerWithGhiOrgAndParticipantWithAbcOrg: ProjectContributorRole[] = [
  { type: 'ProjectManager', affiliation: ghiOrgAsAffiliation },
  { type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation },
];

export const rolesWithProjectManagerWithGhiOrgAndParticipantWithAbcOrgReversed: ProjectContributorRole[] = [
  { type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation },
  { type: 'ProjectManager', affiliation: ghiOrgAsAffiliation },
];

export const rolesWithProjectParticipantWithGhiOrg: ProjectContributorRole[] = [
  { type: 'ProjectParticipant', affiliation: ghiOrgAsAffiliation },
];

export const rolesWithSeveralProjectParticipantRoles: ProjectContributorRole[] = [
  { type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation },
  { type: 'ProjectParticipant', affiliation: defOrgAsAffiliation },
  { type: 'ProjectParticipant', affiliation: ghiOrgAsAffiliation },
];
