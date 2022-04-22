import { SearchResponse } from '../../types/common.types';
import { PublicationConversation } from '../../types/publication_types/messages.types';
import { Registration } from '../../types/registration.types';
import {
  mockMathJaxRegistration,
  mockMessages,
  mockRegistration,
  mockRegistrationCentralImport,
} from './mockRegistration';

export const mockSearchResults: SearchResponse<Registration> = {
  processingTime: 10,
  size: 50,
  hits: [
    mockMathJaxRegistration,
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
export const mockSearchResultsCentralImport: SearchResponse<any> = {
  processingTime: 10,
  size: 1,
  hits: [mockRegistrationCentralImport, mockRegistrationCentralImport],
};

export const mockSearchWorklist: SearchResponse<PublicationConversation> = {
  processingTime: 2,
  size: 1,
  hits: mockMessages,
};
