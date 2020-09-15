interface SearchResultContributor {
  identifier: string;
  name: string;
}

export interface SearchResult {
  id: string;
  contributors: SearchResultContributor[];
  date: string;
  owner: string;
  title: string;
}

export interface LatestPublication {
  identifier: string;
  createdDate: string;
  modifiedDate: string;
  mainTitle: string;
  owner: string;
}
