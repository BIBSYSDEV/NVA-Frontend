import { SearchResponse } from '../../types/common.types';
import { CristinPerson } from '../../types/user.types';
import { mockOrganizationSearch } from './mockOrganizationSearch';

export const mockCristinUserSearch: SearchResponse<CristinPerson> = {
  processingTime: 10,
  size: 2,
  hits: [
    {
      id: 'https://api.dev.nva.aws.unit.no/cristin/person/1',
      identifiers: [
        {
          type: 'CristinIdentifier',
          value: '1',
        },
      ],
      names: [
        {
          type: 'LastName',
          value: 'Etternavn',
        },
        {
          type: 'FirstName',
          value: 'Fornavn',
        },
      ],
      affiliations: [],
    },
    {
      id: 'https://api.dev.nva.aws.unit.no/cristin/person/2',
      identifiers: [
        {
          type: 'CristinIdentifier',
          value: '2',
        },
      ],
      names: [
        {
          type: 'LastName',
          value: 'Doofenshmirtz',
        },
        {
          type: 'FirstName',
          value: 'Heinz',
        },
      ],
      affiliations: [
        {
          organization: mockOrganizationSearch.hits[0].id,
          active: true,
          role: { labels: { nb: 'Manager' } },
        },
      ],
    },
  ],
};
