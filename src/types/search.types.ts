import { Resource } from './resource.types';
import { SearchResult } from './search.types';

export interface SearchResult {
  resources: Resource[];
  searchTerm: string;
  offset: number;
  totalNumberOfHits: number;
}

export const emptySearchResults: SearchResult = {
  resources: [],
  searchTerm: '',
  offset: 0,
  totalNumberOfHits: 0,
};
