import { SearchResponse } from '../../types/common.types';
import { Ticket } from '../../types/publication_types/ticket.types';
import { Registration } from '../../types/registration.types';
import { mockMathJaxRegistration, mockRegistration, mockTicketCollection } from './mockRegistration';
import { mockImportCandidate } from './mockImportCandidate';
import { ImportCandidate } from '../../types/importCandidate';

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

export const mockSearchTasks: SearchResponse<Ticket> = {
  processingTime: 2,
  size: 1,
  hits: mockTicketCollection.tickets,
};

export const mockSearchImportCandidates: SearchResponse<ImportCandidate> = {
  processingTime: 2,
  size: 1,
  hits: [mockImportCandidate],
};
