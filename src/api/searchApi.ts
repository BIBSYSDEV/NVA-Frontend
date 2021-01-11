import { CancelToken } from 'axios';
import { SearchResult } from '../types/search.types';
import { apiRequest } from './apiRequest';

export enum SearchApiPaths {
  REGISTRATIONS = '/search/resources',
}

export const searchRegistrations = async (
  searchTerm?: string,
  numberOfResults = 10,
  searchAfter = 0,
  cancelToken?: CancelToken
) => {
  console.log('numberOfResults', numberOfResults, 'searchAfter', searchAfter);
  const url = searchTerm
    ? `${SearchApiPaths.REGISTRATIONS}?query=${searchTerm}&results=${numberOfResults}&from=${searchAfter}`
    : numberOfResults !== 10 || searchAfter !== 0
    ? `${SearchApiPaths.REGISTRATIONS}?results=${numberOfResults}&from=${searchAfter}`
    : SearchApiPaths.REGISTRATIONS;
  console.log('url', url);
  return await apiRequest<SearchResult>({
    url,
    cancelToken,
  });
};
