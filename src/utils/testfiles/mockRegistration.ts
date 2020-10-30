import { LanguageValues } from '../../types/language.types';
import {
  JournalRegistration,
  RegistrationStatus,
  DoiRequestStatus,
  Registration,
} from '../../types/registration.types';
import { JournalType, PublicationType } from '../../types/publicationFieldNames';
import { BackendTypeNames } from '../../types/publication_types/commonRegistration.types';
import { mockCustomerInstitution } from './mockCustomerInstitutions';

export const mockRegistration: JournalRegistration = {
  type: BackendTypeNames.PUBLICATION,
  identifier: '12345679',
  createdDate: '2020',
  owner: 'tu@unit.no',
  status: RegistrationStatus.DRAFT,
  project: null,
  publisher: { id: mockCustomerInstitution.id },
  fileSet: {
    type: BackendTypeNames.FILE_SET,
    files: [
      {
        type: BackendTypeNames.FILE,
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
  entityDescription: {
    type: BackendTypeNames.ENTITY_DESCRIPTION,
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
      type: BackendTypeNames.PUBLICATION_DATE,
      year: '1980',
      month: '12',
      day: '12',
    },
    contributors: [
      {
        type: BackendTypeNames.CONTRIBUTOR,
        affiliations: [],
        correspondingAuthor: true,
        email: 'test@test.no',
        identity: {
          type: BackendTypeNames.IDENTITY,
          id: '901790000000',
          name: 'Test User',
        },
        role: '',
        sequence: 1,
      },
      {
        type: BackendTypeNames.CONTRIBUTOR,
        affiliations: [],
        correspondingAuthor: false,
        email: '',
        identity: {
          type: BackendTypeNames.IDENTITY,
          id: '901790000001',
          name: 'Osteloff, Oddny',
        },
        role: '',
        sequence: 2,
      },
    ],
    reference: {
      type: BackendTypeNames.REFERENCE,
      doi: '',
      publicationInstance: {
        type: JournalType.ARTICLE,
        pages: null,
        peerReviewed: false,
        articleNumber: '',
        issue: '',
        volume: '',
      },
      publicationContext: {
        type: PublicationType.PUBLICATION_IN_JOURNAL,
        level: null,
        openAccess: false,
        peerReviewed: false,
        title: '',
        onlineIssn: '',
      },
    },
  },
};

const mockRegistrationWithPendingDoiRequest: JournalRegistration = {
  ...mockRegistration,
  doiRequest: {
    type: 'DoiRequest',
    date: new Date().toISOString(),
    status: DoiRequestStatus.Requested,
    messages: [
      {
        text: 'Hello Mr. Curator! A have a question about this publication, okay?',
        author: 'creator@unit.no',
        timestamp: new Date(2020, 1).toISOString(),
      },
      {
        text: 'Yes, how may I assist you my dear friend?',
        author: 'curator@unit.no',
        timestamp: new Date(2020, 2).toISOString(),
      },
      {
        text: "I don't know...",
        author: 'creator@unit.no',
        timestamp: new Date(2020, 3).toISOString(),
      },
    ],
  },
};

export const mockRegistrationsWithPendingDoiRequest: Registration[] = [mockRegistrationWithPendingDoiRequest];
