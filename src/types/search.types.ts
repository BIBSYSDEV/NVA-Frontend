import { PublicationDate } from './publication.types';

interface SearchResultContributor {
  id?: string;
  name: string;
}

export interface SearchResult {
  id: string;
  contributors: SearchResultContributor[];
  date: PublicationDate;
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
