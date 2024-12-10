import { FetchNviCandidatesParams } from '../api/searchApi';
import { TicketType } from './publication_types/ticket.types';
import { RegistrationTab } from './registration.types';

export interface PreviousPathLocationState {
  previousPath?: string;
}

export type HighestTouchedTab = RegistrationTab | -1;

export interface RegistrationFormLocationState extends PreviousPathLocationState {
  highestValidatedTab?: HighestTouchedTab;
  goToLandingPageAfterSaveAndSee?: boolean;
}

export interface PreviousSearchLocationState {
  previousSearch?: string;
}

export interface SelectedTicketTypeLocationState {
  selectedTicketType?: TicketType;
}

export type BasicDataLocationState = PreviousPathLocationState & PreviousSearchLocationState;

export interface NviCandidatePageLocationState extends PreviousSearchLocationState {
  candidateOffsetState?: {
    currentOffset: number;
    nviQueryParams: FetchNviCandidatesParams;
  };
}
