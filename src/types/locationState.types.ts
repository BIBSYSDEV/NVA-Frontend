import { FetchNviCandidatesParams } from '../api/searchApi';
import { RegistrationTab } from './registration.types';

export interface PreviousPathLocationState {
  previousPath?: string;
}

export type HighestTouchedTab = RegistrationTab | -1;
export interface RegistrationFormLocationState extends PreviousPathLocationState {
  highestValidatedTab?: HighestTouchedTab;
}

export interface PreviousSearchLocationState {
  previousSearch?: string;
}

export interface NviCandidatePageLocationState extends PreviousSearchLocationState {
  candidateOffsetState?: {
    currentOffset: number;
    nviQueryParams: FetchNviCandidatesParams;
  };
}
