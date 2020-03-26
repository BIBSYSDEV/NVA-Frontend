import Axios from 'axios';
import { PublicationTableNumber } from '../utils/constants';

export enum PublicationChannelApiPaths {
  SEARCH = '/publication-channel/search',
}

export const getPublishers = async (searchTerm: string, publicationTable: PublicationTableNumber) => {
  try {
    const response = await Axios({
      method: 'POST',
      url: PublicationChannelApiPaths.SEARCH,
      data: { searchTerm: `%${searchTerm}%`, tableId: publicationTable },
    });
    return response.data.results;
  } catch {
    return [];
  }
};
