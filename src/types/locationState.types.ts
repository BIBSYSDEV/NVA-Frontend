import { FetchNviCandidatesParams } from '../api/searchApi';
import { TicketType } from './publication_types/ticket.types';

export interface PreviousPathLocationState {
  previousPath?: string;
}

export interface RegistrationFormLocationState extends PreviousPathLocationState {
  skipInitialValidation?: boolean;
}

export interface PreviousSearchLocationState {
  previousSearch?: string;
}

export interface SelectedTicketTypeLocationState {
  selectedTicketType?: TicketType;
}

export type BasicDataLocationState = (PreviousPathLocationState & PreviousSearchLocationState) | null;

export interface NviCandidatePageLocationState extends PreviousSearchLocationState {
  candidateOffsetState?: {
    currentOffset: number;
    nviQueryParams: FetchNviCandidatesParams;
  };
  isOnDisputePage?: boolean;
}
