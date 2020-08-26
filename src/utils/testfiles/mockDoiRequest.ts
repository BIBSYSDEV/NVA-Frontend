import { DoiRequest } from '../../types/doiRequest.types';
import { mockPublication } from './mockPublication';

const mockDoiRequest: DoiRequest = {
  doiRequestStatus: 'Draft',
  doiRequestDate: '2005-05-25',
  publicationIdentifier: mockPublication.identifier,
  publicationTitle: mockPublication.entityDescription.mainTitle,
  publicationCreator: mockPublication.owner,
};

export const mockDoiRequests: DoiRequest[] = new Array(3).fill(mockDoiRequest);
