import { Publisher } from '../../types/registration.types';

export const mockPublishersSearch: Publisher[] = [
  {
    id: 'https://api.dev.nva.aws.unit.no/publication-channels/publisher/1/2020',
    identifier: '1',
    name: 'Publisher number 1',
    website: 'http://www.publisher1.org/',
    active: true,
  },
  {
    id: 'https://api.dev.nva.aws.unit.no/publication-channels/publisher/2/2020',
    identifier: '2',
    name: 'Publisher number 2',
    website: 'http://www.publisher2.it/',
    active: true,
  },
  {
    id: 'https://api.dev.nva.aws.unit.no/publication-channels/publisher/3/2020',
    identifier: '3',
    name: 'Publisher number 3',
    website: 'https://www.publisher3.com/',
    active: true,
  },
];
