import Axios from 'axios';

import { PUBLICATION_CHANNEL_API_URL, PublicationTableNumber } from '../../utils/constants';

const getQueryWithSearchTerm = (searchTerm: string, tableId: number) => ({
  tabell_id: tableId,
  api_versjon: 1,
  statuslinje: 'N',
  begrensning: '10',
  kodetekst: 'J',
  desimal_separator: '.',
  variabler: ['*'],
  sortBy: [],
  filter: [{ variabel: 'Original tittel', selection: { filter: 'like', values: [`%${searchTerm}%`] } }],
});

export const getDataFromNsd = async (searchTerm: string, publicationTable: PublicationTableNumber) => {
  if (publicationTable === PublicationTableNumber.PUBLICATION_CHANNELS) {
    return await getPublicationChannels(searchTerm);
  } else {
    return await getPublishers(searchTerm);
  }
};

export const getPublicationChannels = async (searchTerm: string) => {
  try {
    const response = await Axios({
      method: 'POST',
      url: PUBLICATION_CHANNEL_API_URL,
      data: getQueryWithSearchTerm(searchTerm, PublicationTableNumber.PUBLICATION_CHANNELS),
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

export const getPublishers = async (searchTerm: string) => {
  try {
    const response = await Axios({
      method: 'POST',
      url: PUBLICATION_CHANNEL_API_URL,
      data: getQueryWithSearchTerm(searchTerm, PublicationTableNumber.PUBLISHERS),
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
