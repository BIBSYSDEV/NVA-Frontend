import { VariantType } from 'notistack';

import { Resource } from '../types/resource.types';

export const SEARCH_FOR_RESOURCES = 'search for resources';
export const CLEAR_SEARCH = 'clear search';
export const SEARCH_FAILURE = 'search failure';

export const searchForResources = (
  resources: Resource[],
  searchTerm: string,
  totalNumberOfHits: number,
  offset?: number
) => ({
  type: SEARCH_FOR_RESOURCES,
  resources,
  searchTerm,
  totalNumberOfHits,
  offset: offset ? offset : 0,
});

export const searchFailureAction = (message: string) => ({
  type: SEARCH_FAILURE,
  message,
  variant: 'error',
});

export const clearSearch = () => ({
  type: CLEAR_SEARCH,
});

export interface SearchForResourcesAction {
  type: typeof SEARCH_FOR_RESOURCES;
  resources: Resource[];
  searchTerm: string;
  totalNumberOfHits: number;
  offset?: number;
}

export interface ClearSearchAction {
  type: typeof CLEAR_SEARCH;
}

export interface SearchFailureAction {
  type: typeof SEARCH_FAILURE;
  message: string;
  variant: VariantType;
}

export type ResourceActions = SearchForResourcesAction | ClearSearchAction | SearchFailureAction;
