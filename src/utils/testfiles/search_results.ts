import { SearchResult } from '../../types/registration.types';
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
