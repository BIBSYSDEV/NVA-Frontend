import { MessagesResponse } from '../../types/publication_types/messages.types';
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
  took: 2,
  total: 1,
  hits: mockMessages,
};
