import { FetchNviCandidatesParams } from '../api/searchApi';

export interface RegistrationFormLocationState {
  backPath?: string;
}

export interface NviCandidatePageLocationState {
  candidateOffsetState?: {
    currentOffset: number;
    nviQueryParams: FetchNviCandidatesParams;
  };
  previousSearch?: string;
}
