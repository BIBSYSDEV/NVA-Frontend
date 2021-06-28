import { PublicationTableNumber } from '../utils/constants';
import { apiRequest } from './apiRequest';
import { Publisher } from '../types/registration.types';
import { CancelToken } from 'axios';
import { PublicationChannelApiPaths } from './apiPaths';

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
