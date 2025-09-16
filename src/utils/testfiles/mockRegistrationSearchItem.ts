import { ContributorRole } from '../../types/contributor.types';
import { JournalType, PublicationType } from '../../types/publicationFieldNames';
import { RegistrationSearchItem, RegistrationStatus } from '../../types/registration.types';

export const mockRegistrationSearchItem: RegistrationSearchItem = {
  recordMetadata: {
    status: RegistrationStatus.Published,
    createdDate: new Date(2020, 1).toISOString(),
    modifiedDate: new Date(2020, 2).toISOString(),
    publishedDate: '2024',
  },
  id: 'https://api.dev.nva.aws.unit.no/registration/12345679',
  identifier: '12345679',
  type: JournalType.AcademicArticle,
  mainTitle:
    'Computer simulations show that Neanderthal facial morphology represents adaptation to cold and high energy demands, but not heavy biting',
  publicationDate: {
    type: 'PublicationDate',
    year: '1980',
    month: '12',
    day: '12',
  },
  contributorsPreview: [
    {
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
      affiliations: [
        {
          type: 'UnconfirmedOrganization',
          name: 'My institution',
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
    {
      affiliations: [
        {
          type: 'UnconfirmedOrganization',
          name: 'My institution',
        },
      ],
      correspondingAuthor: false,
      identity: {
        type: 'Identity',
        name: 'Osteloff, Oddvar',
      },
      role: ContributorRole.Other,
      sequence: 3,
    },
  ],
  contributorsCount: 3,
  publishingDetails: {
    id: '1234',
    type: PublicationType.Report,
    series: {
      name: 'Test series',
      id: '12345',
    },
    doi: '',
  },
  abstract:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras tincidunt, ante vitae convallis interdum, ipsum enim tempor dolor, sit amet condimentum lorem neque non sem. Nulla volutpat turpis elit. Nam fringilla sed nisi quis blandit. Nulla porttitor egestas massa, a fringilla nunc. Fusce at ornare urna. Sed luctus odio et velit dignissim, vel suscipit eros maximus. Nullam volutpat velit vel ante vestibulum, vitae accumsan lacus faucibus.\n\nNulla ultrices porta elit non scelerisque. In hac habitasse platea dictumst. Maecenas cursus lacinia magna non ultrices. Proin id porttitor mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vitae tempus nunc. Maecenas eu leo gravida, dictum velit sit amet, faucibus tortor. Nam ut lacus pretium, aliquam risus sed, faucibus enim ',
  description:
    'Morbi sed neque egestas, egestas lacus ac, tincidunt metus. Donec quis ipsum vulputate, tempus nisi vulputate, commodo orci. Suspendisse blandit condimentum ex quis egestas. Ut rhoncus eros non condimentum mattis. Ut lectus nisi, molestie sit amet hendrerit ut, mollis vel odio. In a risus tellus. Morbi rutrum augue metus, ut malesuada ex posuere vitae. Nam nec rhoncus turpis.',
};

export const mockRegistrationSearchItemWithMathJax = {
  ...mockRegistrationSearchItem,
  mainTitle: 'The title \\(\\sqrt{25} = 5~\\hbox{ost}\\) and \\(A_{FB}^{\\mathrm{b}\\overline{\\mathrm{b}}}\\)',
  abstract:
    'This is abstract -> \\(\\sqrt{25} = 5~\\hbox{ost}\\) and \\(X_{AB}^{\\mathrm{c}\\overline{\\mathrm{d}}}\\) and so on it goes.',
};
