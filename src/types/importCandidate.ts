import { Organization } from './organization.types';
import { PublicationInstanceType } from './registration.types';

export enum ImportStatus {
  Imported = 'IMPORTED',
  NotImported = 'NOT_IMPORTED',
  NotApplicable = 'NOT_APPLICABLE',
}

export interface Publisher {
  id: string;
  name: string;
}

export interface Journal {
  id: string;
}

export interface ImportCandidate {
  type: 'ImportCandidate';
  id: string;
  additionalIdentifiers: string[];
  importStatus: ImportStatus;
  doi: string;
  publicationYear: string;
  mainTitle: string;
  totalContributors: number;
  totalVerifiedContributors: number;
  organizations: Organization[];
  publisher: Publisher;
  journal: Journal;
  publicationInstance: PublicationInstanceType;
}
