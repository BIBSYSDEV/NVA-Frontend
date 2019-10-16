import { Resource } from './resource.types';
import { SearchResults } from './search.types';

export interface SearchResults {
  resources: Resource[];
  searchTerm: string;
}

export const emptySearchResults: SearchResults = {
  resources: [],
  searchTerm: '',
};
