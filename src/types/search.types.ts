import { Resource } from './resource.types';

export interface Search {
  resources: Resource[];
  searchTerm: string;
  offset: number;
  totalNumberOfHits: number;
}

export const emptySearch: Search = {
  resources: [],
  searchTerm: '',
  offset: 0,
  totalNumberOfHits: 0,
};
