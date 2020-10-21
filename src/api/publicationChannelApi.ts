import { PublicationTableNumber } from '../utils/constants';
import { apiRequest } from './apiRequest';
import { Publisher } from '../types/publication.types';

export enum PublicationChannelApiPaths {
  SEARCH = '/channel/search',
}

interface PublisherSearchResponse {
  results: Publisher[];
}

export const getPublishers = async (searchTerm: string, publicationTable: PublicationTableNumber) =>
  await apiRequest<PublisherSearchResponse>({
    url: PublicationChannelApiPaths.SEARCH,
    method: 'POST',
    data: { searchTerm: `%${searchTerm}%`, tableId: publicationTable },
  });
