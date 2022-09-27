import { SearchResponse } from '../../types/common.types';
import { Ticket } from '../../types/publication_types/messages.types';
import { Registration } from '../../types/registration.types';
import { mockMathJaxRegistration, mockMessages, mockRegistration } from './mockRegistration';

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
    mockRegistration,
  ],
};

export const mockSearchWorklist: SearchResponse<Ticket> = {
  processingTime: 2,
  size: 1,
  hits: mockMessages.tickets,
};
