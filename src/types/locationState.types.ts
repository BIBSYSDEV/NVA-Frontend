import { FetchNviCandidatesParams } from '../api/searchApi';

export interface NviCandidatePageLocationState {
  candidateOffsetState?: {
    currentOffset: number;
    nviQueryParams: FetchNviCandidatesParams;
  };
  previousSearch?: string;
}
