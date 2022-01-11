import { MessagesResponse } from '../../pages/worklist/WorklistPage';
import { SearchResult } from '../../types/registration.types';
import { mockMessages, mockRegistration } from './mockRegistration';

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

export const mockSearchWorklist: MessagesResponse = {
  hits: { hits: mockMessages.map((message) => ({ _source: message })) },
};
