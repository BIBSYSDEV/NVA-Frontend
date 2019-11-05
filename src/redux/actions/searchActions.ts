import { VariantType } from 'notistack';

import { Resource } from '../../types/resource.types';

export const SEARCH_FOR_RESOURCES = 'search for resources';
export const CLEAR_SEARCH = 'clear search';
export const SEARCH_FAILURE = 'search failure';

export const searchForResources = (
  resources: Resource[],
  searchTerm: string,
  totalNumberOfHits: number,
  offset?: number
): SearchForResourcesAction => ({
  type: SEARCH_FOR_RESOURCES,
  resources,
  searchTerm,
  totalNumberOfHits,
  offset: offset ? offset : 0,
});

export const searchFailure = (message: string): SearchFailureAction => ({
  type: SEARCH_FAILURE,
  message,
  variant: 'error',
});

export const clearSearch = (): ClearSearchAction => ({
  type: CLEAR_SEARCH,
});

interface SearchForResourcesAction {
  type: typeof SEARCH_FOR_RESOURCES;
  resources: Resource[];
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
  variant: VariantType;
}

export type SearchActions = SearchForResourcesAction | ClearSearchAction | SearchFailureAction;
