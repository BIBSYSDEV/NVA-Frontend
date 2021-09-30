import { SearchResult } from '../../types/search.types';
import { mockRegistration } from './mockRegistration';

export const threeMockSearchResults: SearchResult = {
  took: 10,
  total: 3,
  hits: [mockRegistration, mockRegistration, mockRegistration],
};
