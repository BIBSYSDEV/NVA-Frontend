import { LanguageValues } from '../../types/language.types';
import { CristinProject, ProjectSearchResponse } from '../../types/project.types';

export const mockProject: CristinProject = {
  id: 'https://api.dev.nva.aws.unit.no/project/1',
  type: 'Project',
  identifier: [
    {
      type: 'CristinIdentifier',
      value: '1',
    },
  ],
  title: 'A dummy project',
  language: LanguageValues.ENGLISH,
  alternativeTitles: [
    {
      en: 'A dummy project',
    },
  ],
  startDate: '2001-01-01T00:00:00Z',
  endDate: '2001-12-31T00:00:00Z',
  coordinatingInstitution: {
    id: 'https://api.cristin.no/v2/institutions/186',
    type: 'Organization',
    name: {
      nb: 'UiT Norges arktiske universitet',
    },
  },
  contributors: [
    {
      type: 'ProjectManager',
      identity: {
        id: 'https://api.cristin.no/v2/persons/328549',
        type: 'Person',
        firstName: 'Name',
        lastName: 'Nameson',
      },
      affiliation: {
        id: 'https://api.cristin.no/v2/institutions/186',
        type: 'Organization',
        name: {
          nb: 'UiT Norges arktiske universitet',
        },
      },
    },
    {
      type: 'ProjectParticipant',
      identity: {
        id: 'https://api.cristin.no/v2/persons/53368',
        type: 'Person',
        firstName: 'arvid',
        lastName: 'viken',
      },
      affiliation: {
        id: 'https://api.cristin.no/v2/institutions/186',
        type: 'Organization',
        name: {
          nb: 'UiT Norges arktiske universitet',
        },
      },
    },
    {
      type: 'ProjectParticipant',
      identity: {
        id: 'https://api.cristin.no/v2/persons/325305',
        type: 'Person',
        firstName: 'Peder',
        lastName: 'Pedersen',
      },
      affiliation: {
        id: 'https://api.cristin.no/v2/institutions/186',
        type: 'Organization',
        name: {
          nb: 'UiT Norges arktiske universitet',
        },
      },
    },
  ],
};

const mockProjects: CristinProject[] = [
  mockProject,
  {
    id: 'https://api.dev.nva.aws.unit.no/project/414343',
    type: 'Project',
    identifier: [
      {
        type: 'CristinIdentifier',
        value: '414343',
      },
    ],
    title: 'Ornitologisk kartlegging i og ved Semsøyene naturreservat',
    language: LanguageValues.ENGLISH,
    alternativeTitles: [
      {
        en: 'Ornithological taxonomy at Semsøyene Islands Nature Preserve',
      },
    ],
    startDate: '1998-11-01T00:00:00Z',
    endDate: '2001-06-30T00:00:00Z',
    coordinatingInstitution: {
      id: 'https://api.cristin.no/v2/institutions/222',
      type: 'Organization',
      name: {
        nb: 'Universitetet i Sørøst-Norge',
      },
    },
    contributors: [
      {
        type: 'ProjectManager',
        identity: {
          id: 'https://api.cristin.no/v2/persons/319749',
          type: 'Person',
          firstName: 'Kari',
          lastName: 'Karisen',
        },
        affiliation: {
          id: 'https://api.cristin.no/v2/institutions/222',
          type: 'Organization',
          name: {
            nb: 'Universitetet i Sørøst-Norge',
          },
        },
      },
    ],
  },
  {
    id: 'https://api.dev.nva.aws.unit.no/project/414392',
    type: 'Project',
    identifier: [
      {
        type: 'CristinIdentifier',
        value: '414392',
      },
    ],
    title: 'Naturbasert avløpsteknologi',
    language: LanguageValues.ENGLISH,
    alternativeTitles: [
      {
        en: 'Natural Treatment Systems',
      },
    ],
    startDate: '1995-01-01T00:00:00Z',
    endDate: '2002-12-31T00:00:00Z',
    coordinatingInstitution: {
      id: 'https://api.cristin.no/v2/institutions/222',
      type: 'Organization',
      name: {
        nb: 'Universitetet i Sørøst-Norge',
      },
    },
    contributors: [
      {
        type: 'ProjectManager',
        identity: {
          id: 'https://api.cristin.no/v2/persons/27546',
          type: 'Person',
          firstName: 'Anonym',
          lastName: 'Person',
        },
        affiliation: {
          id: 'https://api.cristin.no/v2/institutions/222',
          type: 'Organization',
          name: {
            nb: 'Universitetet i Sørøst-Norge',
          },
        },
      },
    ],
  },
  {
    id: 'https://api.dev.nva.aws.unit.no/project/414451',
    type: 'Project',
    identifier: [
      {
        type: 'CristinIdentifier',
        value: '414451',
      },
    ],
    title: 'Tørking og duggpunktbestemmelse av naturgass',
    language: LanguageValues.ENGLISH,
    alternativeTitles: [
      {
        en: 'Natural Gas dehydration and Dewpointing',
      },
    ],
    startDate: '1999-03-01T00:00:00Z',
    endDate: '2002-02-28T00:00:00Z',
    coordinatingInstitution: {
      id: 'https://api.cristin.no/v2/institutions/222',
      type: 'Organization',
      name: {
        nb: 'Universitetet i Sørøst-Norge',
      },
    },
    contributors: [
      {
        type: 'ProjectManager',
        identity: {
          id: 'https://api.cristin.no/v2/persons/43310',
          type: 'Person',
          firstName: 'Guri',
          lastName: 'Malla',
        },
        affiliation: {
          id: 'https://api.cristin.no/v2/institutions/222',
          type: 'Organization',
          name: {
            nb: 'Universitetet i Sørøst-Norge',
          },
        },
      },
      {
        type: 'ProjectParticipant',
        identity: {
          id: 'https://api.cristin.no/v2/persons/26002',
          type: 'Person',
          firstName: 'Sopp',
          lastName: 'Soppesen',
        },
        affiliation: {
          id: 'https://api.cristin.no/v2/institutions/222',
          type: 'Organization',
          name: {
            nb: 'Universitetet i Sørøst-Norge',
          },
        },
      },
      {
        type: 'ProjectParticipant',
        identity: {
          id: 'https://api.cristin.no/v2/persons/26022',
          type: 'Person',
          firstName: 'Ost',
          lastName: 'Loff',
        },
        affiliation: {
          id: 'https://api.cristin.no/v2/institutions/222',
          type: 'Organization',
          name: {
            nb: 'Universitetet i Sørøst-Norge',
          },
        },
      },
    ],
  },
  {
    id: 'https://api.dev.nva.aws.unit.no/project/414803',
    type: 'Project',
    identifier: [
      {
        type: 'CristinIdentifier',
        value: '414803',
      },
    ],
    title: 'Antikkens syn på mennesket og naturen',
    language: LanguageValues.ENGLISH,
    alternativeTitles: [
      {
        en: 'The View of Man and Nature in Greek Culture',
      },
    ],
    startDate: '1995-01-01T00:00:00Z',
    endDate: '1998-12-31T00:00:00Z',
    coordinatingInstitution: {
      id: 'https://api.cristin.no/v2/institutions/222',
      type: 'Organization',
      name: {
        nb: 'Universitetet i Sørøst-Norge',
      },
    },
    contributors: [
      {
        type: 'ProjectManager',
        identity: {
          id: 'https://api.cristin.no/v2/persons/319632',
          type: 'Person',
          firstName: 'Knut',
          lastName: 'Kebab',
        },
        affiliation: {
          id: 'https://api.cristin.no/v2/institutions/222',
          type: 'Organization',
          name: {
            nb: 'Universitetet i Sørøst-Norge',
          },
        },
      },
    ],
  },
];

export const mockProjectSearch: ProjectSearchResponse = {
  id: 'https://api.dev.nva.aws.unit.no/project/search?QUERY_PARAMS',
  size: 0,
  searchString: 'title=natu',
  processingTime: 5828,
  firstRecord: 0,
  hits: mockProjects,
};
