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
