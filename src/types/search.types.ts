import { Registration } from './registration.types';

export interface SearchResult {
  hits: Registration[];
  took: number;
  total: number;
}

// Note: These names should match format of SearchRegistration
export enum SearchFieldName {
  ContributorId = 'contributors.id',
  Id = 'id',
  ModifiedDate = 'modifiedDate',
  PublishedDate = 'publishedDate',
  Type = 'type',
}
