import { SearchResponse } from '../../types/common.types';
import { CristinProject } from '../../types/project.types';

export const mockProject: CristinProject = {
  id: 'https://api.dev.nva.aws.unit.no/cristin/project/1',
  type: 'Project',
  identifier: [
    {
      type: 'CristinIdentifier',
      value: '1',
    },
  ],
  created: {
    sourceShortName: 'NVA',
  },
  creator: {
    type: 'ProjectCreator',
    identity: {
      type: 'Person',
      id: 'https://api.dev.nva.aws.unit.no/cristin/person/1',
      firstName: 'Bob',
      lastName: 'Boffaloe',
    },
    affiliation: {
      id: 'https://api.dev.nva.aws.unit.no/cristin/organization/1.0.0.0',
      type: 'Organization',
      labels: {
        nb: 'Jamaica',
      },
    },
  },
  funding: [],
  academicSummary: {},
  popularScientificSummary: {},
  status: 'ACTIVE',
  title: 'A dummy project',
  language: 'http://lexvo.org/id/iso639-3/eng',
  alternativeTitles: [
    {
      en: 'A dummy project',
    },
  ],
  startDate: '2001-01-01T00:00:00Z',
  endDate: '2001-12-31T00:00:00Z',
  coordinatingInstitution: {
    id: 'https://api.dev.nva.aws.unit.no/cristin/organization/186.0.0.0',
    type: 'Organization',
    labels: {
      nb: 'UiT Norges arktiske universitet',
    },
  },
  contributors: [
    {
      type: 'ProjectManager',
      identity: {
        id: 'https://api.dev.nva.aws.unit.no/cristin/person/328549',
        type: 'Person',
        firstName: 'Name',
        lastName: 'Nameson',
      },
      affiliation: {
        id: 'https://api.dev.nva.aws.unit.no/cristin/organization/186.0.0.0',
        type: 'Organization',
        labels: {
          nb: 'UiT Norges arktiske universitet',
        },
      },
    },
    {
      type: 'ProjectParticipant',
      identity: {
        id: 'https://api.dev.nva.aws.unit.no/cristin/person/53368',
        type: 'Person',
        firstName: 'arvid',
        lastName: 'viken',
      },
      affiliation: {
        id: 'https://api.dev.nva.aws.unit.no/cristin/organization/186.0.0.0',
        type: 'Organization',
        labels: {
          nb: 'UiT Norges arktiske universitet',
        },
      },
    },
    {
      type: 'ProjectParticipant',
      identity: {
        id: 'https://api.dev.nva.aws.unit.no/cristin/person/1',
        type: 'Person',
        firstName: 'Peder',
        lastName: 'Pedersen',
      },
      affiliation: {
        id: 'https://api.dev.nva.aws.unit.no/cristin/organization/186.0.0.0',
        type: 'Organization',
        labels: {
          nb: 'UiT Norges arktiske universitet',
        },
      },
    },
  ],
  projectCategories: [],
  keywords: [],
  relatedProjects: [],
};

const mockProjects: CristinProject[] = [
  mockProject,
  {
    id: 'https://api.dev.nva.aws.unit.no/cristin/project/414343',
    type: 'Project',
    identifier: [
      {
        type: 'CristinIdentifier',
        value: '414343',
      },
    ],
    created: {
      sourceShortName: 'NVA',
    },
    creator: {
      type: 'ProjectCreator',
      identity: {
        type: 'Person',
        id: 'https://api.dev.nva.aws.unit.no/cristin/person/1',
        firstName: 'Bob',
        lastName: 'Boffaloe',
      },
      affiliation: {
        id: 'https://api.dev.nva.aws.unit.no/cristin/organization/1.0.0.0',
        type: 'Organization',
        labels: {
          nb: 'Jamaica',
        },
      },
    },
    funding: [],
    academicSummary: {},
    popularScientificSummary: {},
    status: 'ACTIVE',
    title: 'Ornitologisk kartlegging i og ved Semsøyene naturreservat',
    language: 'http://lexvo.org/id/iso639-3/eng',
    alternativeTitles: [
      {
        en: 'Ornithological taxonomy at Semsøyene Islands Nature Preserve',
      },
    ],
    startDate: '1998-11-01T00:00:00Z',
    endDate: '2001-06-30T00:00:00Z',
    coordinatingInstitution: {
      id: 'https://api.dev.nva.aws.unit.no/cristin/organization/222.0.0.0',
      type: 'Organization',
      labels: {
        nb: 'Universitetet i Sørøst-Norge',
      },
    },
    contributors: [
      {
        type: 'ProjectManager',
        identity: {
          id: 'https://api.dev.nva.aws.unit.no/cristin/person/319749',
          type: 'Person',
          firstName: 'Kari',
          lastName: 'Karisen',
        },
        affiliation: {
          id: 'https://api.dev.nva.aws.unit.no/cristin/organization/222.0.0.0',
          type: 'Organization',
          labels: {
            nb: 'Universitetet i Sørøst-Norge',
          },
        },
      },
    ],
    projectCategories: [],
    keywords: [],
    relatedProjects: [],
  },
  {
    id: 'https://api.dev.nva.aws.unit.no/cristin/project/414392',
    type: 'Project',
    identifier: [
      {
        type: 'CristinIdentifier',
        value: '414392',
      },
    ],
    created: {
      sourceShortName: 'NVA',
    },
    creator: {
      type: 'ProjectCreator',
      identity: {
        type: 'Person',
        id: 'https://api.dev.nva.aws.unit.no/cristin/person/1',
        firstName: 'Bob',
        lastName: 'Boffaloe',
      },
      affiliation: {
        id: 'https://api.dev.nva.aws.unit.no/cristin/organization/1.0.0.0',
        type: 'Organization',
        labels: {
          nb: 'Jamaica',
        },
      },
    },
    funding: [],
    academicSummary: {},
    popularScientificSummary: {},
    status: 'ACTIVE',
    title: 'Naturbasert avløpsteknologi',
    language: 'http://lexvo.org/id/iso639-3/eng',
    alternativeTitles: [
      {
        en: 'Natural Treatment Systems',
      },
    ],
    startDate: '1995-01-01T00:00:00Z',
    endDate: '2002-12-31T00:00:00Z',
    coordinatingInstitution: {
      id: 'https://api.dev.nva.aws.unit.no/cristin/organization/222.0.0.0',
      type: 'Organization',
      labels: {
        nb: 'Universitetet i Sørøst-Norge',
      },
    },
    contributors: [
      {
        type: 'ProjectManager',
        identity: {
          id: 'https://api.dev.nva.aws.unit.no/cristin/person/27546',
          type: 'Person',
          firstName: 'Anonym',
          lastName: 'Person',
        },
        affiliation: {
          id: 'https://api.dev.nva.aws.unit.no/cristin/organization/222.0.0.0',
          type: 'Organization',
          labels: {
            nb: 'Universitetet i Sørøst-Norge',
          },
        },
      },
    ],
    projectCategories: [],
    keywords: [],
    relatedProjects: [],
  },
  {
    id: 'https://api.dev.nva.aws.unit.no/cristin/project/414451',
    type: 'Project',
    identifier: [
      {
        type: 'CristinIdentifier',
        value: '414451',
      },
    ],
    created: {
      sourceShortName: 'NVA',
    },
    creator: {
      type: 'ProjectCreator',
      identity: {
        type: 'Person',
        id: 'https://api.dev.nva.aws.unit.no/cristin/person/1',
        firstName: 'Bob',
        lastName: 'Boffaloe',
      },
      affiliation: {
        id: 'https://api.dev.nva.aws.unit.no/cristin/organization/1.0.0.0',
        type: 'Organization',
        labels: {
          nb: 'Jamaica',
        },
      },
    },
    funding: [],
    academicSummary: {},
    popularScientificSummary: {},
    status: 'CONCLUDED',
    title: 'Tørking og duggpunktbestemmelse av naturgass',
    language: 'http://lexvo.org/id/iso639-3/eng',
    alternativeTitles: [
      {
        en: 'Natural Gas dehydration and Dewpointing',
      },
    ],
    startDate: '1999-03-01T00:00:00Z',
    endDate: '2002-02-28T00:00:00Z',
    coordinatingInstitution: {
      id: 'https://api.dev.nva.aws.unit.no/cristin/organization/222.0.0.0',
      type: 'Organization',
      labels: {
        nb: 'Universitetet i Sørøst-Norge',
      },
    },
    contributors: [
      {
        type: 'ProjectManager',
        identity: {
          id: 'https://api.dev.nva.aws.unit.no/cristin/person/43310',
          type: 'Person',
          firstName: 'Guri',
          lastName: 'Malla',
        },
        affiliation: {
          id: 'https://api.dev.nva.aws.unit.no/cristin/organization/222.0.0.0',
          type: 'Organization',
          labels: {
            nb: 'Universitetet i Sørøst-Norge',
          },
        },
      },
      {
        type: 'ProjectParticipant',
        identity: {
          id: 'https://api.dev.nva.aws.unit.no/cristin/person/26002',
          type: 'Person',
          firstName: 'Sopp',
          lastName: 'Soppesen',
        },
        affiliation: {
          id: 'https://api.dev.nva.aws.unit.no/cristin/organization/222.0.0.0',
          type: 'Organization',
          labels: {
            nb: 'Universitetet i Sørøst-Norge',
          },
        },
      },
      {
        type: 'ProjectParticipant',
        identity: {
          id: 'https://api.dev.nva.aws.unit.no/cristin/person/26022',
          type: 'Person',
          firstName: 'Ost',
          lastName: 'Loff',
        },
        affiliation: {
          id: 'https://api.dev.nva.aws.unit.no/cristin/organization/222.0.0.0',
          type: 'Organization',
          labels: {
            nb: 'Universitetet i Sørøst-Norge',
          },
        },
      },
    ],
    projectCategories: [],
    keywords: [],
    relatedProjects: [],
  },
  {
    id: 'https://api.dev.nva.aws.unit.no/cristin/project/414803',
    type: 'Project',
    identifier: [
      {
        type: 'CristinIdentifier',
        value: '414803',
      },
    ],
    created: {
      sourceShortName: 'NVA',
    },
    creator: {
      type: 'ProjectCreator',
      identity: {
        type: 'Person',
        id: 'https://api.dev.nva.aws.unit.no/cristin/person/1',
        firstName: 'Bob',
        lastName: 'Boffaloe',
      },
      affiliation: {
        id: 'https://api.dev.nva.aws.unit.no/cristin/organization/1.0.0.0',
        type: 'Organization',
        labels: {
          nb: 'Jamaica',
        },
      },
    },
    funding: [],
    academicSummary: {},
    popularScientificSummary: {},
    status: 'NOTSTARTED',
    title: 'Antikkens syn på mennesket og naturen',
    language: 'http://lexvo.org/id/iso639-3/eng',
    alternativeTitles: [
      {
        en: 'The View of Man and Nature in Greek Culture',
      },
    ],
    startDate: '1995-01-01T00:00:00Z',
    endDate: '1998-12-31T00:00:00Z',
    coordinatingInstitution: {
      id: 'https://api.dev.nva.aws.unit.no/cristin/organization/222.0.0.0',
      type: 'Organization',
      labels: {
        nb: 'Universitetet i Sørøst-Norge',
      },
    },
    contributors: [
      {
        type: 'ProjectManager',
        identity: {
          id: 'https://api.dev.nva.aws.unit.no/cristin/person/319632',
          type: 'Person',
          firstName: 'Knut',
          lastName: 'Kebab',
        },
        affiliation: {
          id: 'https://api.dev.nva.aws.unit.no/cristin/organization/222.0.0.0',
          type: 'Organization',
          labels: {
            nb: 'Universitetet i Sørøst-Norge',
          },
        },
      },
    ],
    projectCategories: [],
    keywords: [],
    relatedProjects: [],
  },
];

export const mockProjectSearch: SearchResponse<CristinProject> = {
  size: 5,
  processingTime: 5828,
  hits: mockProjects,
};
