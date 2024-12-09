import { AggregationValue, UnconfirmedOrganization } from './common.types';
import { Contributor } from './contributor.types';
import { Organization } from './organization.types';
import {
  PublicationInstance,
  Publisher,
  Registration,
  RegistrationAggregations,
  SerialPublication,
} from './registration.types';

export type ImportCandidateStatus = 'IMPORTED' | 'NOT_IMPORTED' | 'NOT_APPLICABLE';

export interface ImportStatus {
  candidateStatus: ImportCandidateStatus;
  modifiedDate?: string;
  setBy?: string;
  nvaPublicationId?: string;
  comment?: string;
}

export interface ImportCandidate extends Registration {
  type: 'ImportCandidate';
  importStatus: ImportStatus;
}

export type CollaborationType = 'Collaborative' | 'NonCollaborative';

export interface ImportCandidateAggregations
  extends Pick<RegistrationAggregations, 'type' | 'topLevelOrganization' | 'files'> {
  importStatus?: AggregationValue<ImportCandidateStatus>[];
  collaborationType?: AggregationValue<CollaborationType>[];
}

export interface ImportCandidateSummary {
  type: 'ImportCandidateSummary';
  createdDate: string;
  id: string;
  additionalIdentifiers: string[];
  importStatus: ImportStatus;
  doi: string;
  publicationYear: string;
  mainTitle: string;
  totalContributors: number;
  totalVerifiedContributors: number;
  organizations: (Pick<Organization, 'type' | 'id' | 'labels'> | UnconfirmedOrganization)[];
  publisher?: Partial<Publisher>;
  journal?: Partial<SerialPublication>;
  publicationInstance: PublicationInstance;
  contributors: Contributor[];
  printIssn?: string;
  onlineIssn?: string;
}
