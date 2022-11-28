import { ContributorRole } from '../../types/contributor.types';
import { JournalType } from '../../types/publicationFieldNames';
import { PublicationChannelType, RegistrationStatus } from '../../types/registration.types';
import { mockCustomerInstitution } from './mockCustomerInstitutions';
import { TicketCollection } from '../../types/publication_types/messages.types';
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
  associatedArtifacts: [
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
    npiSubjectHeading: '0003',
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

export const mockMathJaxRegistration: JournalRegistration = {
  ...mockRegistration,
  entityDescription: {
    ...mockRegistration.entityDescription,
    mainTitle: 'The title $$\\sqrt{25} = 5~\\hbox {ost}$$ and $A_{FB}^{\\mathrm{b}\\overline{\\mathrm{b}}}$',
    abstract:
      'This is abastract -> $$\\sqrt{25} = 5~\\hbox {ost}$$ and $X_{AB}^{\\mathrm{c}\\overline{\\mathrm{d}}}$ and so on it goes.',
  },
};

export const mockTicketCollection: TicketCollection = {
  type: 'TicketCollection',
  tickets: [
    {
      type: 'GeneralSupportCase',
      status: 'Pending',
      createdDate: new Date(2020, 1).toISOString(),
      modifiedDate: new Date(2020, 1).toISOString(),
      id: `${mockRegistration.id}/ticket/1`,
      identifier: '1',
      publication: {
        id: mockRegistration.id,
        identifier: mockRegistration.identifier,
        mainTitle: mockRegistration.entityDescription.mainTitle,
      },
      viewedBy: [],
      messages: [
        {
          text: 'Hello Mr. Curator! A have a question about this publication, okay?',
          sender: 'creator@unit.no',
          owner: 'creator@unit.no',
          date: new Date(2020, 1).toISOString(),
          id: 'http://test.no/1',
          identifier: '1',
          recipient: 'SupportService',
        },
        {
          text: 'Yes, how may I assist you my dear friend?',
          sender: 'curator@unit.no',
          owner: 'creator@unit.no',
          date: new Date(2020, 2).toISOString(),
          id: 'http://test.no/2',
          identifier: '2',
          recipient: 'SupportService',
        },
        {
          text: "I don't know...",
          sender: 'creator@unit.no',
          owner: 'creator@unit.no',
          date: new Date(2020, 3).toISOString(),
          id: 'http://test.no/3',
          identifier: '3',
          recipient: 'SupportService',
        },
      ],
    },
  ],
};

export const mockPublishedRegistration = {
  ...mockRegistration,
  identifier: '123',
  status: RegistrationStatus.Published,
};
