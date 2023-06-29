import { SearchResponse } from '../../types/common.types';
import { Ticket } from '../../types/publication_types/ticket.types';
import { RegistrationSearchResponse } from '../../types/registration.types';
import { mockMathJaxRegistration, mockRegistration, mockTicketCollection } from './mockRegistration';
import { mockImportCandidate } from './mockImportCandidate';
import { ImportCandidateSummary } from '../../types/importCandidate.types';

export const mockSearchResults: RegistrationSearchResponse = {
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
  aggregations: {
    entityDescription: {
      contributors: {
        identity: {
          id: {
            buckets: [
              {
                key: '1234',
                docCount: 1,
                name: {
                  buckets: [
                    {
                      key: 'Test Testesen',
                      docCount: 1,
                    },
                  ],
                },
              },
            ],
          },
        },
      },
      reference: {
        publicationInstance: {
          type: {
            buckets: [
              {
                key: 'AcademicArticle',
                docCount: 3,
              },
            ],
          },
        },
      },
    },
    fundings: { identifier: { buckets: [] } },
    topLevelOrganization: { id: { buckets: [] } },
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
