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

export const unidentifiedDollyIdentity: ProjectContributorIdentity = {
  firstName: 'Dolly',
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

export const projectParticipantRole = {
  type: 'ProjectParticipant',
  affiliation: abcOrgAsAffiliation,
} as ProjectContributorRole;

export const localProjectManagerRole = {
  type: 'LocalProjectManager',
  affiliation: abcOrgAsAffiliation,
} as ProjectContributorRole;

export const undefinedLocalProjectManagerRole = {
  type: 'LocalProjectManager',
  affiliation: undefined,
} as ProjectContributorRole;

export const otherProjectParticipantRole = {
  type: 'ProjectParticipant',
  affiliation: defOrgAsAffiliation,
} as ProjectContributorRole;

export const undefinedProjectParticipantRole = {
  type: 'ProjectParticipant',
  affiliation: undefined,
} as ProjectContributorRole;

export const otherEmptyProjectParticipantRole = {
  type: 'ProjectParticipant',
  affiliation: undefined,
} as ProjectContributorRole;

export const contributorsArrayWithProjectManager: ProjectContributor[] = [
  { identity: existingPersonIdentity, roles: [{ type: 'ProjectManager', affiliation: defOrgAsAffiliation }] },
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

export const contributorsArrayWithSelectedPersonWithSameAffiliationAndLocalProjectManagerRole: ProjectContributor[] = [
  { identity: selectedPersonIdentity, roles: [{ type: 'LocalProjectManager', affiliation: abcOrgAsAffiliation }] },
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

export const contributorsArrayWithUnidentifiedProjectManagerAndOther: ProjectContributor[] = [
  { identity: unidentifiedDaffyIdentity, roles: [{ type: 'ProjectManager', affiliation: defOrgAsAffiliation }] },
  { identity: selectedPersonIdentity, roles: [{ type: 'ProjectParticipant', affiliation: ghiOrgAsAffiliation }] },
];

export const contributorsArrayWithUnidentifiedProjectManagerWithUndefinedRoleAndOther: ProjectContributor[] = [
  { identity: unidentifiedDaffyIdentity, roles: [{ type: 'ProjectManager', affiliation: undefined }] },
  { identity: selectedPersonIdentity, roles: [{ type: 'ProjectParticipant', affiliation: ghiOrgAsAffiliation }] },
];

export const contributorsArrayWithOneUnidentifiedAndOneOther: ProjectContributor[] = [
  { identity: unidentifiedDaffyIdentity, roles: [{ type: 'ProjectParticipant', affiliation: defOrgAsAffiliation }] },
  { identity: selectedPersonIdentity, roles: [{ type: 'ProjectParticipant', affiliation: ghiOrgAsAffiliation }] },
];

export const contributorsArrayWithOneUnidentifiedWithLocalProjectManagerRoleAndOneOther: ProjectContributor[] = [
  { identity: unidentifiedDaffyIdentity, roles: [{ type: 'LocalProjectManager', affiliation: defOrgAsAffiliation }] },
  { identity: selectedPersonIdentity, roles: [{ type: 'ProjectParticipant', affiliation: ghiOrgAsAffiliation }] },
];

export const contributorsArrayWithOneUnidentifiedWithLocalProjectManagerRoleAndOneOtherWithSameAffiliation: ProjectContributor[] =
  [
    { identity: unidentifiedDaffyIdentity, roles: [{ type: 'LocalProjectManager', affiliation: defOrgAsAffiliation }] },
    { identity: selectedPersonIdentity, roles: [{ type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation }] },
  ];

export const contributorsArrayWithOneUnidentifiedWithLocalProjectManagerRoleWithDifferentAffiliationAndOneOtherWithSameAffiliationAsThat: ProjectContributor[] =
  [
    { identity: unidentifiedDaffyIdentity, roles: [{ type: 'LocalProjectManager', affiliation: defOrgAsAffiliation }] },
    { identity: selectedPersonIdentity, roles: [{ type: 'ProjectParticipant', affiliation: defOrgAsAffiliation }] },
  ];

export const contributorsArrayWithOneUnidentifiedWithSameAndOneOther: ProjectContributor[] = [
  { identity: unidentifiedDaffyIdentity, roles: [{ type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation }] },
  { identity: selectedPersonIdentity, roles: [{ type: 'ProjectParticipant', affiliation: ghiOrgAsAffiliation }] },
];

export const contributorsArrayWithOneUnidentifiedWithSameLocalProjectManagerAndOneOther: ProjectContributor[] = [
  { identity: unidentifiedDaffyIdentity, roles: [{ type: 'LocalProjectManager', affiliation: abcOrgAsAffiliation }] },
  { identity: selectedPersonIdentity, roles: [{ type: 'ProjectParticipant', affiliation: ghiOrgAsAffiliation }] },
];

export const contributorsArrayWithOneUnidentifiedWithUndefinedAndOneOther: ProjectContributor[] = [
  { identity: unidentifiedDaffyIdentity, roles: [{ type: 'ProjectParticipant', affiliation: undefined }] },
  { identity: selectedPersonIdentity, roles: [{ type: 'ProjectParticipant', affiliation: ghiOrgAsAffiliation }] },
];

export const contributorsArrayWithOneUnidentifiedWithUndefinedLocalProjectManagerAndOneOther: ProjectContributor[] = [
  { identity: unidentifiedDaffyIdentity, roles: [{ type: 'LocalProjectManager', affiliation: undefined }] },
  { identity: selectedPersonIdentity, roles: [{ type: 'ProjectParticipant', affiliation: ghiOrgAsAffiliation }] },
];

export const contributorsArrayWithOneUnidentifiedWithUndefinedAndOneOtherWithUndefined: ProjectContributor[] = [
  { identity: unidentifiedDaffyIdentity, roles: [{ type: 'ProjectParticipant', affiliation: undefined }] },
  { identity: selectedPersonIdentity, roles: [{ type: 'ProjectParticipant', affiliation: undefined }] },
];

export const contributorsArrayWithOneUnidentifiedWithUndefinedLocalProjectManagerAndOneOtherWithUndefined: ProjectContributor[] =
  [
    { identity: unidentifiedDaffyIdentity, roles: [{ type: 'LocalProjectManager', affiliation: undefined }] },
    { identity: selectedPersonIdentity, roles: [{ type: 'ProjectParticipant', affiliation: undefined }] },
  ];

export const contributorsArrayWithOneUnidentifiedWithSameAndOneOtherWithUndefined: ProjectContributor[] = [
  { identity: unidentifiedDaffyIdentity, roles: [{ type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation }] },
  { identity: selectedPersonIdentity, roles: [{ type: 'ProjectParticipant', affiliation: undefined }] },
];

export const contributorsArrayWithOneUnidentifiedWithSameLocalProjectManagerAndOneOtherWithUndefined: ProjectContributor[] =
  [
    { identity: unidentifiedDaffyIdentity, roles: [{ type: 'LocalProjectManager', affiliation: abcOrgAsAffiliation }] },
    { identity: selectedPersonIdentity, roles: [{ type: 'ProjectParticipant', affiliation: undefined }] },
  ];

export const contributorsArrayWithOneUnidentifiedAndOneOtherWithUndefined: ProjectContributor[] = [
  { identity: unidentifiedDaffyIdentity, roles: [{ type: 'ProjectParticipant', affiliation: defOrgAsAffiliation }] },
  { identity: selectedPersonIdentity, roles: [{ type: 'ProjectParticipant', affiliation: undefined }] },
];

export const contributorsArrayWithOneUnidentifiedLocalProjectManagerAndOneOtherWithUndefined: ProjectContributor[] = [
  { identity: unidentifiedDaffyIdentity, roles: [{ type: 'LocalProjectManager', affiliation: defOrgAsAffiliation }] },
  { identity: selectedPersonIdentity, roles: [{ type: 'ProjectParticipant', affiliation: undefined }] },
];

export const contributorsArrayWithSelectedPersonWithUndefinedAffiliation: ProjectContributor[] = [
  { identity: selectedPersonIdentity, roles: [{ type: 'ProjectParticipant', affiliation: undefined }] },
];
export const contributorsArrayWithOtherPersonWithSameAffiliation: ProjectContributor[] = [
  { identity: existingPersonIdentity, roles: [{ type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation }] },
];

export const contributorsArrayWithUnidentifiedContributorWithDifferentAffiliation: ProjectContributor[] = [
  { identity: unidentifiedDaffyIdentity, roles: [{ type: 'ProjectParticipant', affiliation: defOrgAsAffiliation }] },
];

export const contributorsArrayWithOtherPersonWithDifferentAffiliation: ProjectContributor[] = [
  { identity: existingPersonIdentity, roles: [{ type: 'ProjectParticipant', affiliation: defOrgAsAffiliation }] },
];

export const contributorsArrayWithOtherPersonWithLocalProjectManagerAffiliation: ProjectContributor[] = [
  { identity: existingPersonIdentity, roles: [{ type: 'LocalProjectManager', affiliation: defOrgAsAffiliation }] },
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

export const contributorsArrayWithContributorWithOnlyProjectManagerRole: ProjectContributor[] = [
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

export const contributorsArrayWithUnidentifiedDaffyWithLocalProjectManager: ProjectContributor[] = [
  {
    identity: unidentifiedDaffyIdentity,
    roles: [{ type: 'LocalProjectManager', affiliation: undefined }],
  },
];

export const contributorsArrayWithUnidentifiedDaffyAsLocalProjectManager: ProjectContributor[] = [
  {
    identity: unidentifiedDaffyIdentity,
    roles: [{ type: 'LocalProjectManager', affiliation: undefined }],
  },
];

export const contributorsArrayWithUnidentifiedDaffyWithProjectManagerRole: ProjectContributor[] = [
  {
    identity: unidentifiedDaffyIdentity,
    roles: [{ type: 'ProjectManager', affiliation: undefined }],
  },
];

export const contributorsArrayWithUnidentifiedDaffyWithLotsOfRoles: ProjectContributor[] = [
  {
    identity: unidentifiedDaffyIdentity,
    roles: [
      { type: 'ProjectManager', affiliation: undefined },
      { type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation },
      { type: 'LocalProjectManager', affiliation: defOrgAsAffiliation },
    ],
  },
];

export const contributorsArrayWithUnidentifiedDaffyWithDefinedAffiliation: ProjectContributor[] = [
  {
    identity: unidentifiedDaffyIdentity,
    roles: [{ type: 'ProjectManager', affiliation: abcOrgAsAffiliation }],
  },
];

export const contributorsArrayWithUnidentifiedDaffyWithLocalProjectManagerRole: ProjectContributor[] = [
  {
    identity: unidentifiedDaffyIdentity,
    roles: [{ type: 'LocalProjectManager', affiliation: undefined }],
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

export const contributorsArrayWithUnidentifiedDaffyWithSameLocalProjectManagerAffiliation: ProjectContributor[] = [
  {
    identity: unidentifiedDaffyIdentity,
    roles: [{ type: 'LocalProjectManager', affiliation: abcOrgAsAffiliation }],
  },
];

export const contributorsArrayWithUnidentifiedDaffyWithAffiliation: ProjectContributor[] = [
  {
    identity: unidentifiedDaffyIdentity,
    roles: [{ type: 'ProjectParticipant', affiliation: defOrgAsAffiliation }],
  },
];

export const contributorsArrayWithUnidentifiedDaffyWithLocalProjectManagerAffiliation: ProjectContributor[] = [
  {
    identity: unidentifiedDaffyIdentity,
    roles: [{ type: 'LocalProjectManager', affiliation: defOrgAsAffiliation }],
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

export const rolesWithLocalProjectManagerWithDefOrg: ProjectContributorRole[] = [
  { type: 'LocalProjectManager', affiliation: defOrgAsAffiliation },
];

export const rolesWithUndefinedProjectParticipant: ProjectContributorRole[] = [
  { type: 'ProjectManager', affiliation: abcOrgAsAffiliation },
  { type: 'ProjectParticipant', affiliation: undefined },
];

export const rolesWithUndefinedLocalProjectManager: ProjectContributorRole[] = [
  { type: 'ProjectManager', affiliation: abcOrgAsAffiliation },
  { type: 'LocalProjectManager', affiliation: undefined },
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

export const rolesWithProjectManagerWithGhiOrgAndLocalProjectManagerWithAbcOrg: ProjectContributorRole[] = [
  { type: 'ProjectManager', affiliation: ghiOrgAsAffiliation },
  { type: 'LocalProjectManager', affiliation: abcOrgAsAffiliation },
];

export const rolesWithProjectManagerWithGhiOrgAndParticipantWithAbcOrgReversed: ProjectContributorRole[] = [
  { type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation },
  { type: 'ProjectManager', affiliation: ghiOrgAsAffiliation },
];

export const rolesWithProjectParticipantWithGhiOrg: ProjectContributorRole[] = [
  { type: 'ProjectParticipant', affiliation: ghiOrgAsAffiliation },
];

export const rolesWithLocalProjectManagerWithGhiOrg: ProjectContributorRole[] = [
  { type: 'LocalProjectManager', affiliation: ghiOrgAsAffiliation },
];

export const rolesWithSeveralProjectParticipantRoles: ProjectContributorRole[] = [
  { type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation },
  { type: 'ProjectParticipant', affiliation: defOrgAsAffiliation },
  { type: 'ProjectParticipant', affiliation: ghiOrgAsAffiliation },
];

export const rolesWithSeveralRoles: ProjectContributorRole[] = [
  { type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation },
  { type: 'ProjectParticipant', affiliation: defOrgAsAffiliation },
  { type: 'LocalProjectManager', affiliation: abcOrgAsAffiliation },
  { type: 'LocalProjectManager', affiliation: defOrgAsAffiliation },
  { type: 'ProjectParticipant', affiliation: ghiOrgAsAffiliation },
];

export const rolesWithSeveralRolesAndOneLocalProjectManager: ProjectContributorRole[] = [
  { type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation },
  { type: 'ProjectParticipant', affiliation: defOrgAsAffiliation },
  { type: 'LocalProjectManager', affiliation: abcOrgAsAffiliation },
  { type: 'ProjectParticipant', affiliation: ghiOrgAsAffiliation },
];
