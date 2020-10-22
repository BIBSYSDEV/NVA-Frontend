import { RegistrationDate } from './registration.types';

interface SearchResultContributor {
  id?: string;
  name: string;
}

export interface SearchResult {
  id: string;
  contributors: SearchResultContributor[];
  date: RegistrationDate;
  owner: string;
  title: string;
}

export interface LatestRegistration {
  identifier: string;
  createdDate: string;
  modifiedDate: string;
  mainTitle: string;
  owner: string;
}
