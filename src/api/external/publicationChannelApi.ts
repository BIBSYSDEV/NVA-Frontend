import Axios from 'axios';

import { PUBLISHERS_URL } from '../../utils/constants';

const getQueryWithSearchTerm = (searchTerm: string) => ({
  tabell_id: 851,
  api_versjon: 1,
  statuslinje: 'N',
  begrensning: '10',
  kodetekst: 'J',
  desimal_separator: '.',
  variabler: ['*'],
  sortBy: [],
  filter: [{ variabel: 'Original tittel', selection: { filter: 'like', values: [`%${searchTerm}%`] } }],
});

export const getPublicationChannels = async (searchTerm: string) => {
  try {
    const response = await Axios({
      method: 'POST',
      url: PUBLISHERS_URL,
      data: getQueryWithSearchTerm(searchTerm),
    });
    return response.data.map((item: any) => ({
      title: item['Original tittel'],
      issn: item['Online ISSN'],
      level: item['Nivå 2019'],
      publisher: item['Utgiver'],
    }));
  } catch {
    return [];
  }
};
