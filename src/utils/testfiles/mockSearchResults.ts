import { SearchResponse } from '../../types/common.types';
import { PublicationConversation } from '../../types/publication_types/messages.types';
import { Registration } from '../../types/registration.types';
import { mockMessages, mockRegistration } from './mockRegistration';

export const mockSearchResults: SearchResponse<Registration> = {
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

export const mockSearchWorklist: SearchResponse<PublicationConversation> = {
  took: 2,
  total: 1,
  hits: mockMessages,
};
