import { PublicationMetadata } from '../../types/publication.types';
import { NotificationVariant } from '../../types/notification.types';

export const SEARCH_FOR_PUBLICATIONS = 'search for publications';
export const CLEAR_SEARCH = 'clear search';
export const SEARCH_FAILURE = 'search failure';

export const searchForPublications = (
  publications: PublicationMetadata[],
  searchTerm: string,
  totalNumberOfHits: number,
  offset?: number
): SearchForPublicationsAction => ({
  type: SEARCH_FOR_PUBLICATIONS,
  publications,
  searchTerm,
  totalNumberOfHits,
  offset: offset ? offset : 0,
});

export const searchFailure = (message: string): SearchFailureAction => ({
  type: SEARCH_FAILURE,
  message,
  variant: NotificationVariant.Error,
});

export const clearSearch = (): ClearSearchAction => ({
  type: CLEAR_SEARCH,
});

interface SearchForPublicationsAction {
  type: typeof SEARCH_FOR_PUBLICATIONS;
  publications: PublicationMetadata[];
  searchTerm: string;
  totalNumberOfHits: number;
  offset?: number;
}

interface ClearSearchAction {
  type: typeof CLEAR_SEARCH;
}

interface SearchFailureAction {
  type: typeof SEARCH_FAILURE;
  message: string;
  variant: NotificationVariant;
}

export type SearchActions = SearchForPublicationsAction | ClearSearchAction | SearchFailureAction;
