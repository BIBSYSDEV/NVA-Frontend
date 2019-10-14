import { Resource } from '../types/resource.types';

export const SEARCH_FOR_RESOURCES = 'search for resources';

export const searchForResources = (resources: Resource[], searchTerm: string) => ({
  type: SEARCH_FOR_RESOURCES,
  resources,
  searchTerm,
});

export interface SearchForResourcesAction {
  type: typeof SEARCH_FOR_RESOURCES;
  resources: Resource[];
  searchTerm: string;
}

export type ResourceActions = SearchForResourcesAction;
