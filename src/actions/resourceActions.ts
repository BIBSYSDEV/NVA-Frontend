import { Resource } from '../types/resource.types';

export const SEARCH_FOR_RESOURCES = 'search for resources';

export const searchForResources = (
  resources: Resource[],
  searchTerm: string,
  offset: number,
  totalNumberOfResults: number
) => ({
  type: SEARCH_FOR_RESOURCES,
  resources,
  searchTerm,
  offset,
  totalNumberOfResults,
});

export interface SearchForResourcesAction {
  type: typeof SEARCH_FOR_RESOURCES;
  resources: Resource[];
  searchTerm: string;
  offset: number;
  totalNumberOfResults: number;
}

export type ResourceActions = SearchForResourcesAction;
