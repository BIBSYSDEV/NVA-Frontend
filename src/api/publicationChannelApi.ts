import Axios from 'axios';

import { Publisher } from '../types/references.types';
import { PublicationTableNumber } from '../utils/constants';

export enum PublicationChannelApiUrls {
  SEARCH = '/channel/search',
}

export const getPublishers = async (searchTerm: string, publicationTable: PublicationTableNumber) => {
  try {
    const response = await Axios({
      method: 'POST',
      url: `${PublicationChannelApiUrls.SEARCH}`,
      data: { searchTerm: `%${searchTerm}%`, tableId: publicationTable },
    });
    return response.data.results.map((item: Partial<Publisher>) => ({
      title: item.title,
      level: item.level,
    }));
  } catch {
    return [];
  }
};
