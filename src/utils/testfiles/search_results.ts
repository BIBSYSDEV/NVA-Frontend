import { SearchResult } from '../../types/search.types';
import { mockRegistration } from './mockRegistration';

export const mockSearchResults: SearchResult = {
  took: 10,
  total: 50,
  hits: [
    mockRegistration,
    mockRegistration,
    mockRegistration,
    mockRegistration,
    mockRegistration,
    mockRegistration,
    mockRegistration,
    mockRegistration,
    mockRegistration,
    mockRegistration,
  ],
};
