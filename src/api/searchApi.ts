import { CancelToken } from 'axios';
import { SearchResult } from '../types/search.types';
import { ROWS_PER_PAGE_OPTIONS } from '../utils/constants';
import { apiRequest } from './apiRequest';

export enum SearchApiPaths {
  REGISTRATIONS = '/search/resources',
}

export const searchRegistrations = async (
  searchTerm?: string,
  numberOfResults = ROWS_PER_PAGE_OPTIONS[1],
  searchAfter = 0,
  cancelToken?: CancelToken
) => {
  const url = searchTerm
    ? `${SearchApiPaths.REGISTRATIONS}?query=${searchTerm}&results=${numberOfResults}&from=${searchAfter}`
    : `${SearchApiPaths.REGISTRATIONS}?results=${numberOfResults}&from=${searchAfter}`;
  return await apiRequest<SearchResult>({
    url,
    cancelToken,
  });
};
