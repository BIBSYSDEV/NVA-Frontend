import { RegistrationDate, RegistrationPublisher } from './registration.types';

interface SearchResultContributor {
  id?: string;
  name: string;
}

export interface SearchResult {
  hits: SearchRegistration[];
  took: number;
  total: number;
}

export interface LatestRegistration {
  identifier: string;
  createdDate: string;
  modifiedDate: string;
  mainTitle: string;
  owner: string;
}

export interface SearchRegistration {
  id: string;
  contributors: SearchResultContributor[];
  owner: string;
  title: string;
  publicationType?: string;
  publisher?: RegistrationPublisher;
  publishedDate?: RegistrationDate;
  abstract?: string;
}
