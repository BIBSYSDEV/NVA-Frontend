import { Resource } from '../types/resource.types';

export const FETCH_RESOURCES = 'fetch resources';

export const fetchResources = (resources: Resource[]) => ({
  type: FETCH_RESOURCES,
  resources,
});

export interface FetchResourcesAction {
  type: typeof FETCH_RESOURCES;
  resources: Resource[];
}

export type ResourceActions = FetchResourcesAction;
