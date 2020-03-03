import { PublicationMetadata } from './publication.types';

export interface Search {
  publications: PublicationMetadata[];
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
