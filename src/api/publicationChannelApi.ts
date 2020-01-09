import Axios from 'axios';

import { PUBLICATION_CHANNEL_API_URL, PublicationTableNumber } from '../utils/constants';

interface PublicationChannelItem {
  originalTitle: string;
  printIssn: string;
  onlineIssn: string;
  level: number | null;
  publishing: string;
}

export const getPublishers = async (searchTerm: string, publicationTable: PublicationTableNumber) => {
  try {
    const response = await Axios({
      method: 'POST',
      url: PUBLICATION_CHANNEL_API_URL,
      data: { searchTerm: `%${searchTerm}%`, tableId: publicationTable },
    });
    return response.data.results.map((item: Partial<PublicationChannelItem>) => ({
      title: item.originalTitle,
      level: item.level,
      publisher: item.publishing,
    }));
  } catch {
    return [];
  }
};
