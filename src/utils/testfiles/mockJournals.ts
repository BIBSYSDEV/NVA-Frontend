import { SearchResponse } from '../../types/common.types';
import { SerialPublication } from '../../types/registration.types';

export const mockJournalsSearch: SearchResponse<SerialPublication> = {
  processingTime: 10,
  size: 3,
  hits: [
    {
      type: 'Journal',
      id: 'https://api.dev.nva.aws.unit.no/publication-channels/journal/1/2020',
      identifier: 'J0UR-N4L-NUMB3R-1',
      name: 'Journal number 1',
      sameAs: 'http://www.journal4.com/',
      scientificValue: 'LevelOne',
      onlineIssn: '1111-1111',
      printIssn: '1111-1112',
    },
    {
      type: 'Journal',
      id: 'https://api.dev.nva.aws.unit.no/publication-channels/journal/2/2020',
      identifier: 'J0UR-N4L-NUMB3R-2',
      name: 'Journal number 2',
      sameAs: 'http://www.journal2.com/',
      scientificValue: 'LevelOne',
      onlineIssn: '2222-2222',
    },
    {
      type: 'Journal',
      id: 'https://api.dev.nva.aws.unit.no/publication-channels/journal/3/2020',
      identifier: 'J0UR-N4L-NUMB3R-3',
      name: 'Journal number 3',
      sameAs: 'http://www.journal3.com/',
      scientificValue: 'LevelOne',
      onlineIssn: '3333-3333',
      printIssn: '3333-3334',
    },
  ],
};
