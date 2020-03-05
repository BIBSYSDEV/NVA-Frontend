import { PublicationMetadata } from '../../types/publication.types';

export const SEARCH_FOR_PUBLICATIONS = 'search for publications';
export const CLEAR_SEARCH = 'clear search';

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

export type SearchActions = SearchForPublicationsAction | ClearSearchAction;
