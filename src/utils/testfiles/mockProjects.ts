import { ProjectSearchResponse } from '../../types/project.types';

export const mockProjectsSearch: ProjectSearchResponse = {
  id: 'https://api.ENVIRONMENT.nva.aws.unit.no/project/search?QUERY_PARAMS',
  size: 0,
  searchString: 'title=viking',
  processingTime: 816,
  firstRecord: 0,
  hits: [
    {
      id: 'https://api.dev.nva.unit.no/project/406277',
      type: 'Project',
      identifier: [
        {
          type: 'CristinIdentifier',
          value: '406277',
        },
      ],
      title: 'Tre fremstående vikingtidsdamer med britiske forbindelser',
      language: 'https://lexvo.org/id/iso639-3/nno',
      alternativeTitles: [
        {
          en: 'Three outstanding Viking Ladies with British connnections',
        },
      ],
      startDate: '2010-01-02T00:00:00Z',
      endDate: '2011-02-28T00:00:00Z',
      coordinatingInstitution: {
        id: 'https://api.cristin.no/v2/institutions/217',
        type: 'Organization',
        name: {
          nb: 'Universitetet i Stavanger',
        },
      },
      contributors: [
        {
          type: 'ProjectManager',
          identity: {
            id: 'https://api.cristin.no/v2/persons/334199',
            type: 'Person',
            firstName: 'Helge',
            lastName: 'Sørheim',
          },
          affiliation: {
            id: 'https://api.cristin.no/v2/institutions/217',
            type: 'Organization',
            name: {
              nb: 'Universitetet i Stavanger',
            },
          },
        },
      ],
    },
    {
      id: 'https://api.dev.nva.unit.no/project/414252',
      type: 'Project',
      identifier: [
        {
          type: 'CristinIdentifier',
          value: '414252',
        },
      ],
      title: 'Norrøne tekster og vikingtidshistorie',
      language: 'https://lexvo.org/id/iso639-3/nno',
      alternativeTitles: [
        {
          en: 'Old Norse Texts and Viking History',
        },
      ],
      startDate: '1995-03-01T00:00:00Z',
      endDate: '2005-12-31T00:00:00Z',
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
            id: 'https://api.cristin.no/v2/persons/446719',
            type: 'Person',
            firstName: 'Claus',
            lastName: 'Krag',
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
      id: 'https://api.dev.nva.unit.no/project/414747',
      type: 'Project',
      identifier: [
        {
          type: 'CristinIdentifier',
          value: '414747',
        },
      ],
      title: 'Fra vikinger til Kaptein Scott: heltedyrkelsen i Women in love',
      language: 'https://lexvo.org/id/iso639-3/nno',
      alternativeTitles: [
        {
          en: 'From Vikings to Captain Scott: representing the heroic in Women in love',
        },
      ],
      startDate: '2004-01-01T00:00:00Z',
      endDate: '2005-07-31T00:00:00Z',
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
            id: 'https://api.cristin.no/v2/persons/319502',
            type: 'Person',
            firstName: 'Peter',
            lastName: 'Fjågesund',
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
      id: 'https://api.dev.nva.unit.no/project/426906',
      type: 'Project',
      identifier: [
        {
          type: 'CristinIdentifier',
          value: '426906',
        },
      ],
      title: 'VikingGull - 11201346',
      language: 'https://lexvo.org/id/iso639-3/nno',
      startDate: '2013-08-01T00:00:00Z',
      endDate: '2015-07-31T00:00:00Z',
      coordinatingInstitution: {
        id: 'https://api.cristin.no/v2/institutions/215',
        type: 'Organization',
        name: {
          nb: 'OsloMet - storbyuniversitetet',
        },
      },
      contributors: [
        {
          type: 'ProjectManager',
          identity: {
            id: 'https://api.cristin.no/v2/persons/403581',
            type: 'Person',
            firstName: 'Ingun Grimstad',
            lastName: 'Klepp',
          },
          affiliation: {
            id: 'https://api.cristin.no/v2/institutions/215',
            type: 'Organization',
            name: {
              nb: 'OsloMet - storbyuniversitetet',
            },
          },
        },
        {
          type: 'ProjectParticipant',
          identity: {
            id: 'https://api.cristin.no/v2/persons/509906',
            type: 'Person',
            firstName: 'Gisle Marini',
            lastName: 'Mardal',
          },
          affiliation: {
            id: 'https://api.cristin.no/v2/institutions/0',
            type: 'Organization',
            name: {
              nb: 'Ukjent institusjon',
            },
          },
        },
        {
          type: 'ProjectParticipant',
          identity: {
            id: 'https://api.cristin.no/v2/persons/530000',
            type: 'Person',
            firstName: 'Tone Skårdal',
            lastName: 'Tobiasson',
          },
          affiliation: {
            id: 'https://api.cristin.no/v2/institutions/0',
            type: 'Organization',
            name: {
              nb: 'Ukjent institusjon',
            },
          },
        },
        {
          type: 'ProjectParticipant',
          identity: {
            id: 'https://api.cristin.no/v2/persons/20500',
            type: 'Person',
            firstName: 'Marianne',
            lastName: 'Vedeler',
          },
          affiliation: {
            id: 'https://api.cristin.no/v2/institutions/0',
            type: 'Organization',
            name: {
              nb: 'Ukjent institusjon',
            },
          },
        },
      ],
    },
    {
      id: 'https://api.dev.nva.unit.no/project/685661',
      type: 'Project',
      identifier: [
        {
          type: 'CristinIdentifier',
          value: '685661',
        },
      ],
      title: 'VIKINGS: Volcanic Eruptions and their Impacts on Climate, Environment, and Viking Society in 500-1250 CE',
      language: 'https://lexvo.org/id/iso639-3/nno',
      startDate: '2018-07-01T00:00:00Z',
      endDate: '2023-06-30T00:00:00Z',
      coordinatingInstitution: {
        id: 'https://api.cristin.no/v2/institutions/185',
        type: 'Organization',
        name: {
          nb: 'Universitetet i Oslo',
        },
      },
      contributors: [
        {
          identity: {
            id: 'https://api.cristin.no/v2/persons/592204',
            type: 'Person',
            firstName: 'Kirstin',
            lastName: 'Krüger',
          },
          affiliation: {
            id: 'https://api.cristin.no/v2/institutions/185',
            type: 'Organization',
            name: {
              nb: 'Universitetet i Oslo',
            },
          },
        },
        {
          type: 'ProjectManager',
          identity: {
            id: 'https://api.cristin.no/v2/persons/592204',
            type: 'Person',
            firstName: 'Kirstin',
            lastName: 'Krüger',
          },
          affiliation: {
            id: 'https://api.cristin.no/v2/institutions/185',
            type: 'Organization',
            name: {
              nb: 'Universitetet i Oslo',
            },
          },
        },
        {
          identity: {
            id: 'https://api.cristin.no/v2/persons/8748',
            type: 'Person',
            firstName: 'Frode',
            lastName: 'Iversen',
          },
          affiliation: {
            id: 'https://api.cristin.no/v2/institutions/185',
            type: 'Organization',
            name: {
              nb: 'Universitetet i Oslo',
            },
          },
        },
        {
          type: 'ProjectParticipant',
          identity: {
            id: 'https://api.cristin.no/v2/persons/8748',
            type: 'Person',
            firstName: 'Frode',
            lastName: 'Iversen',
          },
          affiliation: {
            id: 'https://api.cristin.no/v2/institutions/185',
            type: 'Organization',
            name: {
              nb: 'Universitetet i Oslo',
            },
          },
        },
        {
          identity: {
            id: 'https://api.cristin.no/v2/persons/825267',
            type: 'Person',
            firstName: 'Anne Hope',
            lastName: 'Jahren',
          },
          affiliation: {
            id: 'https://api.cristin.no/v2/institutions/185',
            type: 'Organization',
            name: {
              nb: 'Universitetet i Oslo',
            },
          },
        },
        {
          type: 'ProjectParticipant',
          identity: {
            id: 'https://api.cristin.no/v2/persons/825267',
            type: 'Person',
            firstName: 'Anne Hope',
            lastName: 'Jahren',
          },
          affiliation: {
            id: 'https://api.cristin.no/v2/institutions/185',
            type: 'Organization',
            name: {
              nb: 'Universitetet i Oslo',
            },
          },
        },
        {
          identity: {
            id: 'https://api.cristin.no/v2/persons/23391',
            type: 'Person',
            firstName: 'Henrik',
            lastName: 'Svensen',
          },
          affiliation: {
            id: 'https://api.cristin.no/v2/institutions/185',
            type: 'Organization',
            name: {
              nb: 'Universitetet i Oslo',
            },
          },
        },
        {
          type: 'ProjectParticipant',
          identity: {
            id: 'https://api.cristin.no/v2/persons/23391',
            type: 'Person',
            firstName: 'Henrik',
            lastName: 'Svensen',
          },
          affiliation: {
            id: 'https://api.cristin.no/v2/institutions/185',
            type: 'Organization',
            name: {
              nb: 'Universitetet i Oslo',
            },
          },
        },
        {
          type: 'ProjectParticipant',
          identity: {
            id: 'https://api.cristin.no/v2/persons/50501',
            type: 'Person',
            firstName: 'Jostein',
            lastName: 'Bakke',
          },
          affiliation: {
            id: 'https://api.cristin.no/v2/institutions/184',
            type: 'Organization',
            name: {
              nb: 'Universitetet i Bergen',
            },
          },
        },
        {
          type: 'ProjectParticipant',
          identity: {
            id: 'https://api.cristin.no/v2/persons/50501',
            type: 'Person',
            firstName: 'Jostein',
            lastName: 'Bakke',
          },
          affiliation: {
            id: 'https://api.cristin.no/v2/institutions/184',
            type: 'Organization',
            name: {
              nb: 'Universitetet i Bergen',
            },
          },
        },
      ],
    },
  ],
};
