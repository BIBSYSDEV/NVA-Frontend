import { SearchResult } from '../../types/search.types';
import { BackendTypeNames } from '../../types/publication_types/commonRegistration.types';

export const threeMockSearchResults: SearchResult = {
  took: 10,
  total: 3,
  hits: [
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/32290378-373e-4cca-8f24-d02b92d845ce',
      publicationDate: { type: BackendTypeNames.INDEX_DATE, year: '2019', month: '8', day: '26' },
      title: 'Dove, The',
      owner: 'mfalvey0@pen.io',
      contributors: [
        {
          id: '04bfdced-e65a-483f-bcaa-a83ad7218b60',
          name: 'Alasdair Dyter',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/d90f87c9-fb5b-41ef-8575-584b50102476',
      publicationDate: { type: BackendTypeNames.INDEX_DATE, year: '2018', month: '8', day: '26' },
      title: 'Bad Santa',
      owner: 'fhanwell1@businessweek.com',
      contributors: [
        {
          id: '9022e8b1-e908-4b22-b051-c62ff4dc7854',
          name: 'Ailene Strippling',
        },
        {
          id: '8c9a8043-b110-4597-bf40-a6183d9a0c01',
          name: 'Kirstyn Jenik',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/c01b4fe3-bd3c-4b89-8d3a-4cced90a53e6',
      publicationDate: { type: BackendTypeNames.INDEX_DATE, year: '2019', month: '12', day: '26' },
      title: 'Carey Treatment, The',
      owner: 'okobsch2@a8.net',
      contributors: [
        {
          id: 'eb918407-16fb-44e1-a1ac-32a7837d1f59',
          name: 'Alberto Kuzma',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
  ],
};
