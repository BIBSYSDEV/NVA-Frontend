import { PublicationTableNumber } from '../utils/constants';
import { apiRequest } from './apiRequest';
import { Publisher } from '../types/registration.types';
import { CancelToken } from 'axios';

export enum PublicationChannelApiPaths {
  SEARCH = '/channel/search',
}

interface PublisherSearchResponse {
  results: Publisher[];
}

export const getPublishers = async (
  searchTerm: string,
  publicationTable: PublicationTableNumber,
  cancelToken?: CancelToken
) =>
  await apiRequest<PublisherSearchResponse>({
    url: PublicationChannelApiPaths.SEARCH,
    method: 'POST',
    data: { searchTerm: `%${searchTerm}%`, tableId: publicationTable },
    cancelToken,
  });
