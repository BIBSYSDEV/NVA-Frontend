import { SearchResponse, SearchResponse2 } from '../../types/common.types';
import { ImportCandidateSummary } from '../../types/importCandidate.types';
import { Ticket } from '../../types/publication_types/ticket.types';
import { JournalType } from '../../types/publicationFieldNames';
import { RegistrationAggregations, RegistrationSearchItem2 } from '../../types/registration.types';
import { mockImportCandidate } from './mockImportCandidate';
import { mockTicketCollection } from './mockRegistration';
import { mockRegistrationSearchItem, mockRegistrationSearchItemWithMathJax } from './mockRegistrationSearchItem';

export const mockSearchResults: SearchResponse2<RegistrationSearchItem2, RegistrationAggregations> = {
  totalHits: 50,
  hits: [
    mockRegistrationSearchItemWithMathJax,
    mockRegistrationSearchItem,
    mockRegistrationSearchItem,
    mockRegistrationSearchItem,
    mockRegistrationSearchItem,
    mockRegistrationSearchItem,
    mockRegistrationSearchItem,
    mockRegistrationSearchItem,
    mockRegistrationSearchItem,
    mockRegistrationSearchItem,
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
