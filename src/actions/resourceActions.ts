import { Resource } from '../types/resource.types';

export const SEARCH_FOR_RESOURCES = 'search for resources';

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

export interface SearchForResourcesAction {
  type: typeof SEARCH_FOR_RESOURCES;
  resources: Resource[];
  searchTerm: string;
  totalNumberOfHits: number;
  offset?: number;
}

export type ResourceActions = SearchForResourcesAction;
