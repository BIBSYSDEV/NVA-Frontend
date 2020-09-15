import { SearchResult } from '../../types/search.types';

export const threeMockSearchResults: SearchResult[] = [
  {
    id: 'https://frontend.dev.nva.aws.unit.no/publication/32290378-373e-4cca-8f24-d02b92d845ce',
    date: { year: '2019', month: '8', day: '26' },
    title: 'Dove, The',
    owner: 'mfalvey0@pen.io',
    contributors: [
      {
        identifier: '04bfdced-e65a-483f-bcaa-a83ad7218b60',
        name: 'Alasdair Dyter',
      },
    ],
  },
  {
    id: 'https://frontend.dev.nva.aws.unit.no/publication/d90f87c9-fb5b-41ef-8575-584b50102476',
    date: { year: '2018', month: '8', day: '26' },
    title: 'Bad Santa',
    owner: 'fhanwell1@businessweek.com',
    contributors: [
      {
        identifier: '9022e8b1-e908-4b22-b051-c62ff4dc7854',
        name: 'Ailene Strippling',
      },
      {
        identifier: '8c9a8043-b110-4597-bf40-a6183d9a0c01',
        name: 'Kirstyn Jenik',
      },
    ],
  },
  {
    id: 'https://frontend.dev.nva.aws.unit.no/publication/c01b4fe3-bd3c-4b89-8d3a-4cced90a53e6',
    date: { year: '2019', month: '12', day: '26' },
    title: 'Carey Treatment, The',
    owner: 'okobsch2@a8.net',
    contributors: [
      {
        identifier: 'eb918407-16fb-44e1-a1ac-32a7837d1f59',
        name: 'Alberto Kuzma',
      },
    ],
  },
];
