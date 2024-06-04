import { SearchResponse, SearchResponse2 } from '../../types/common.types';
import { ImportCandidateSummary } from '../../types/importCandidate.types';
import { JournalType } from '../../types/publicationFieldNames';
import { Ticket } from '../../types/publication_types/ticket.types';
import { Registration, RegistrationAggregations } from '../../types/registration.types';
import { mockImportCandidate } from './mockImportCandidate';
import { mockMathJaxRegistration, mockRegistration, mockTicketCollection } from './mockRegistration';

export const mockSearchResults: SearchResponse2<Registration, RegistrationAggregations> = {
  totalHits: 50,
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
  aggregations: {
    type: [{ id: 'asd', key: JournalType.AcademicArticle, count: 3 }],
    fundingSource: [],
    topLevelOrganization: [],
  },
};

export const mockSearchTasks: SearchResponse<Ticket> = {
  processingTime: 2,
  size: 1,
  hits: mockTicketCollection.tickets,
};

export const mockSearchImportCandidates: SearchResponse<ImportCandidateSummary> = {
  processingTime: 2,
  size: 1,
  hits: [mockImportCandidate],
};
