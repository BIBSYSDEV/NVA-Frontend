import { Resource } from './resource.types';
import { SearchResults } from './search.types';

export interface SearchResults {
  resources: Resource[];
  searchTerm: string;
  offset: number;
  totalNumberOfHits: number;
}

export const emptySearchResults: SearchResults = {
  resources: [],
  searchTerm: '',
  offset: 0,
  totalNumberOfHits: 0,
};
