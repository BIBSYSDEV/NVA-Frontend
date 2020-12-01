import { CancelToken } from 'axios';
import { SearchResult } from '../types/search.types';
import { apiRequest } from './apiRequest';

export enum SearchApiPaths {
  REGISTRATIONS = '/search/resources',
}

export const searchRegistrations = async (
  searchTerm?: string,
  numberOfResults?: number,
  searchAfter?: string,
  cancelToken?: CancelToken
) => {
  const url = searchTerm ? `${SearchApiPaths.REGISTRATIONS}?query=${searchTerm}` : SearchApiPaths.REGISTRATIONS;
  return await apiRequest<SearchResult>({
    url,
    cancelToken,
  });
};
