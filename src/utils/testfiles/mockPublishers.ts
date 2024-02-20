import { SearchResponse } from '../../types/common.types';
import { Publisher } from '../../types/registration.types';

export const mockPublishersSearch: SearchResponse<Publisher> = {
  processingTime: 5,
  size: 3,
  hits: [
    {
      type: 'Publisher',
      id: 'https://api.dev.nva.aws.unit.no/publication-channels/publisher/1/2020',
      identifier: 'PUB-LISH-ER-NUMBER-1',
      name: 'Publisher number 1',
      sameAs: 'http://www.publisher1.org/',
      scientificValue: 'LevelZero',
    },
    {
      type: 'Publisher',
      id: 'https://api.dev.nva.aws.unit.no/publication-channels/publisher/2/2020',
      identifier: 'PUB-LISH-ER-NUMBER-2',
      name: 'Publisher number 2',
      sameAs: 'http://www.publisher2.it/',
      scientificValue: 'LevelOne',
    },
    {
      type: 'Publisher',
      id: 'https://api.dev.nva.aws.unit.no/publication-channels/publisher/3/2020',
      identifier: 'PUB-LISH-ER-NUMBER-3',
      name: 'Publisher number 3',
      sameAs: 'https://www.publisher3.com/',
      scientificValue: 'LevelOne',
    },
  ],
};
