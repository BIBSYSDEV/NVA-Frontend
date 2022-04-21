import { ContributorRole } from '../../types/contributor.types';
import { JournalType } from '../../types/publicationFieldNames';
import { PublicationChannelType, RegistrationStatus } from '../../types/registration.types';
import { mockCustomerInstitution } from './mockCustomerInstitutions';
import { MessageType, PublicationConversation } from '../../types/publication_types/messages.types';
import { JournalRegistration } from '../../types/publication_types/journalRegistration.types';
import { JournalArticleContentType } from '../../types/publication_types/content.types';
import { mockUser } from './mock_feide_user';

export const mockRegistration: JournalRegistration = {
  type: 'Publication',
  id: 'https://frontend.dev.nva.aws.unit.no/registration/12345679',
  identifier: '12345679',
  createdDate: new Date(2020, 1).toISOString(),
  modifiedDate: new Date(2020, 2).toISOString(),
  resourceOwner: {
    owner: mockUser['custom:nvaUsername'] ?? '',
    ownerAffiliation: 'https://api.dev.nva.aws.unit.no/cristin/organization/20754.0.0.0',
  },
  status: RegistrationStatus.Draft,
  projects: [
    { type: 'ResearchProject', id: 'https://api.dev.nva.aws.unit.no/cristin/project/1', name: 'A dummy project' },
  ],
  publisher: { id: mockCustomerInstitution.id },
  fileSet: {
    type: 'FileSet',
    files: [
      {
        type: 'File',
        identifier: '3214324',
        name: 'filename.pdf',
        size: 10,
        mimeType: '',
        administrativeAgreement: false,
        publisherAuthority: false,
        embargoDate: null,
        license: null,
      },
    ],
  },
  subjects: [],
  entityDescription: {
    type: 'EntityDescription',
    mainTitle:
      'Computer simulations show that Neanderthal facial morphology represents adaptation to cold and high energy demands, but not heavy biting',
    abstract:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras tincidunt, ante vitae convallis interdum, ipsum enim tempor dolor, sit amet condimentum lorem neque non sem. Nulla volutpat turpis elit. Nam fringilla sed nisi quis blandit. Nulla porttitor egestas massa, a fringilla nunc. Fusce at ornare urna. Sed luctus odio et velit dignissim, vel suscipit eros maximus. Nullam volutpat velit vel ante vestibulum, vitae accumsan lacus faucibus.\n\nNulla ultrices porta elit non scelerisque. In hac habitasse platea dictumst. Maecenas cursus lacinia magna non ultrices. Proin id porttitor mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vitae tempus nunc. Maecenas eu leo gravida, dictum velit sit amet, faucibus tortor. Nam ut lacus pretium, aliquam risus sed, faucibus enim ',
    description:
      'Morbi sed neque egestas, egestas lacus ac, tincidunt metus. Donec quis ipsum vulputate, tempus nisi vulputate, commodo orci. Suspendisse blandit condimentum ex quis egestas. Ut rhoncus eros non condimentum mattis. Ut lectus nisi, molestie sit amet hendrerit ut, mollis vel odio. In a risus tellus. Morbi rutrum augue metus, ut malesuada ex posuere vitae. Nam nec rhoncus turpis.',
    tags: ['Ost', 'Loff', 'Majones'],
    language: 'http://lexvo.org/id/iso639-3/eng',
    npiSubjectHeading: 'Medisin og helsefag',
    date: {
      type: 'PublicationDate',
      year: '1980',
      month: '12',
      day: '12',
    },
    contributors: [
      {
        type: 'Contributor',
        affiliations: [],
        correspondingAuthor: true,
        identity: {
          type: 'Identity',
          id: '901790000000',
          name: 'Test User',
        },
        role: ContributorRole.Creator,
        sequence: 1,
      },
      {
        type: 'Contributor',
        affiliations: [
          {
            type: 'Organization',
            labels: {
              en: 'My institution',
            },
          },
        ],
        correspondingAuthor: false,
        identity: {
          type: 'Identity',
          name: 'Osteloff, Oddny',
        },
        role: ContributorRole.Creator,
        sequence: 2,
      },
    ],
    reference: {
      type: 'Reference',
      doi: '',
      publicationInstance: {
        type: JournalType.Article,
        pages: {
          type: 'Range',
          begin: '',
          end: '',
        },
        peerReviewed: false,
        articleNumber: '1',
        issue: '2',
        volume: '3',
        corrigendumFor: '',
        contentType: JournalArticleContentType.AcademicArticle,
      },
      publicationContext: {
        type: PublicationChannelType.Journal,
        title: 'International Journal of Human-Computer Interaction',
        onlineIssn: '1044-7318',
      },
    },
  },
};

export const mockRegistration2 = {
  type: 'Publication',
  publicationContextUris: ['https://api.dev.nva.aws.unit.no/publication-channels/journal/476390/2022'],
  '@context': {
    '@vocab': 'https://bibsysdev.github.io/src/nva/ontology.ttl#',
    id: '@id',
    type: '@type',
    contributors: {
      '@container': '@set',
    },
    additionalIdentifiers: {
      '@container': '@set',
    },
    affiliations: {
      '@container': '@set',
    },
    subjects: {
      '@container': '@set',
    },
    projects: {
      '@container': '@set',
    },
    tags: {
      '@container': '@set',
    },
    isbnList: {
      '@container': '@set',
    },
    venues: {
      '@container': '@set',
    },
    files: {
      '@container': '@set',
    },
    grants: {
      '@container': '@set',
    },
    approvals: {
      '@container': '@set',
    },
    messages: {
      '@container': '@set',
    },
  },
  id: 'https://api.dev.nva.aws.unit.no/publication/0180185106c4-3d675f50-024a-4430-a9ae-656fa798067f',
  createdDate: '2022-04-11T11:10:04.991455Z',
  doi: 'https://handle.stage.datacite.org/10.16903/8dds-cp02',
  entityDescription: {
    type: 'EntityDescription',
    abstract: 'Hewldfsldkj',
    contributors: [
      {
        type: 'Contributor',
        affiliations: [
          {
            id: 'https://api.dev.nva.aws.unit.no/cristin/organization/20754.0.0.0',
            type: 'Organization',
          },
        ],
        correspondingAuthor: false,
        identity: {
          id: 'https://api.dev.nva.aws.unit.no/cristin/person/33311',
          type: 'Identity',
          name: 'Orestis Gkorgkas',
        },
        role: 'Creator',
        sequence: 1,
      },
    ],
    date: {
      type: 'PublicationDate',
      day: '11',
      month: '4',
      year: '2022',
    },
    description: 'dsfsdf',
    language: 'http://lexvo.org/id/iso639-3/eng',
    mainTitle: 'Orestis test 2022-04-11',
    reference: {
      type: 'Reference',
      publicationContext: {
        id: 'https://api.dev.nva.aws.unit.no/publication-channels/journal/476390/2022',
        type: 'Journal',
        active: true,
        identifier: '476390',
        language: {
          id: 'http://lexvo.org/id/iso639-3/eng',
        },
        level: '2',
        name: 'Proceedings of the VLDB Endowment',
        npiDomain: 'Informatikk og datateknikk',
        onlineIssn: '2150-8097',
        publisherId: 'https://api.dev.nva.aws.unit.no/publication-channels/publisher/18077/2022',
        website: {
          id: 'http://www.eecs.umich.edu/db/pvldb/',
        },
      },
      publicationInstance: {
        type: 'JournalArticle',
        articleNumber: '1',
        contentType: 'Research article',
        originalResearch: false,
        pages: {
          type: 'Range',
        },
        peerReviewed: true,
      },
    },
    tags: ['sdf'],
  },
  fileSet: {
    type: 'FileSet',
    files: [
      {
        type: 'File',
        administrativeAgreement: false,
        identifier: '7f18c81a-f354-4605-b6ff-95d4153b8825',
        license: {
          type: 'License',
          identifier: 'CC0',
          labels: {
            nb: 'CC0',
          },
        },
        mimeType: 'application/pdf',
        name: 'vldb09-677233.pdf',
        publisherAuthority: true,
        size: 428244,
      },
    ],
  },
  identifier: '0180185106c4-3d675f50-024a-4430-a9ae-656fa798067f',
  modelVersion: '0.16.0',
  modifiedDate: '2022-04-11T11:12:35.172098Z',
  owner: '33311@20754.0.0.0',
  publishedDate: '2022-04-11T11:12:35.487774Z',
  publisher: {
    id: 'https://api.dev.nva.aws.unit.no/customer/f50dff3a-e244-48c7-891d-cc4d75597321',
    type: 'Organization',
  },
  resourceOwner: {
    owner: '33311@20754.0.0.0',
    ownerAffiliation: 'https://api.dev.nva.aws.unit.no/cristin/organization/20754.0.0.0',
  },
  status: 'PUBLISHED',
  subjects: ['https://nva.unit.no/hrcs/activity/hrcs_ra_2_5'],
};

export const mockMathJaxRegistration: JournalRegistration = {
  ...mockRegistration,
  entityDescription: {
    ...mockRegistration.entityDescription,
    mainTitle: 'The title $$\\sqrt{25} = 5~\\hbox {ost}$$ and $A_{FB}^{\\mathrm{b}\\overline{\\mathrm{b}}}$',
    abstract:
      'This is abastract -> $$\\sqrt{25} = 5~\\hbox {ost}$$ and $X_{AB}^{\\mathrm{c}\\overline{\\mathrm{d}}}$ and so on it goes.',
  },
};

export const mockMessages: PublicationConversation[] = [
  {
    type: 'PublicationConversation',
    publication: {
      identifier: mockRegistration.identifier,
      mainTitle: mockRegistration.entityDescription.mainTitle,
      createdDate: mockRegistration.createdDate,
      status: mockRegistration.status,
      owner: mockRegistration.resourceOwner.owner,
    },
    messageCollections: [
      {
        messageType: MessageType.Support,
        messages: [
          {
            text: 'Hello Mr. Curator! A have a question about this publication, okay?',
            sender: 'creator@unit.no',
            owner: 'creator@unit.no',
            date: new Date(2020, 1).toISOString(),
            id: 'http://test.no/1',
            identifier: '1',
          },
          {
            text: 'Yes, how may I assist you my dear friend?',
            sender: 'curator@unit.no',
            owner: 'creator@unit.no',
            date: new Date(2020, 2).toISOString(),
            id: 'http://test.no/2',
            identifier: '2',
          },
          {
            text: "I don't know...",
            sender: 'creator@unit.no',
            owner: 'creator@unit.no',
            date: new Date(2020, 3).toISOString(),
            id: 'http://test.no/3',
            identifier: '3',
          },
        ],
      },
    ],
  },
];

export const mockPublishedRegistration = { ...mockRegistration, identifier: 123, status: RegistrationStatus.Published };
