import { VariantType } from 'notistack';

import { Resource } from '../../types/resource.types';

export const SEARCH = 'search';
export const CLEAR_SEARCH = 'clear search';
export const SEARCH_FAILURE = 'search failure';

export const searchAction = (
  resources: Resource[],
  searchTerm: string,
  totalNumberOfHits: number,
  offset?: number
): SearchAction => ({
  type: SEARCH,
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

export interface SearchAction {
  type: typeof SEARCH;
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

export type SearchActions = SearchAction | ClearSearchAction | SearchFailureAction;
