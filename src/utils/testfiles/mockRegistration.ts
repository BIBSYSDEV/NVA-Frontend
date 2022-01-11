import { ContributorRole } from '../../types/contributor.types';
import { LanguageValues } from '../../types/language.types';
import { JournalType } from '../../types/publicationFieldNames';
import { PublicationChannelType, RegistrationStatus } from '../../types/registration.types';
import { mockCustomerInstitution } from './mockCustomerInstitutions';
import { MessageType, PublicationConversation } from '../../types/publication_types/messages.types';
import { JournalRegistration } from '../../types/publication_types/journalRegistration.types';
import { JournalArticleContentType } from '../../types/publication_types/content.types';

export const mockRegistration: JournalRegistration = {
  type: 'Publication',
  id: 'https://frontend.dev.nva.aws.unit.no/registration/12345679',
  identifier: '12345679',
  createdDate: new Date(2020, 1).toISOString(),
  modifiedDate: new Date(2020, 2).toISOString(),
  owner: 'tu@unit.no',
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
    language: LanguageValues.ENGLISH,
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
        contentType: JournalArticleContentType.ResearchArticle,
      },
      publicationContext: {
        type: PublicationChannelType.Journal,
        title: 'International Journal of Human-Computer Interaction',
        onlineIssn: '1044-7318',
      },
    },
  },
};

export const mockMessages: PublicationConversation[] = [
  {
    publication: mockRegistration,
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
