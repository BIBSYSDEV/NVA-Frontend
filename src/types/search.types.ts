interface SearchResultContributor {
  identifier: string;
  name: string;
}

export interface SearchResult {
  identifier: string;
  createdDate: string;
  modifiedDate: string;
  mainTitle: string;
  owner: string;
  contributors: SearchResultContributor[];
}

export interface Search {
  publications: any[];
  searchTerm: string;
  offset: number;
  totalNumberOfHits: number;
}

export const emptySearch: Search = {
  publications: [],
  searchTerm: '',
  offset: 0,
  totalNumberOfHits: 0,
};
