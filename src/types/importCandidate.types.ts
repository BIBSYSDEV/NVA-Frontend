import { AssociatedArtifact } from './associatedArtifact.types';
import { AggregationValue, UnconfirmedOrganization } from './common.types';
import { Contributor } from './contributor.types';
import { Organization } from './organization.types';
import {
  AdditionalIdentifier,
  EntityDescription,
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

interface SourceOrganizationIdentifier {
  type: 'SourceOrganizationIdentifier';
  affiliationIdentifier: string;
  departmentIdentifier: string;
}

interface SourceOrganization {
  type: 'SourceOrganization';
  identifier: SourceOrganizationIdentifier;
  names: string[];
  country: {
    code: string;
    name: string;
  };
  address: {
    locality: string;
  };
}

export interface ImportAffiliation {
  type: 'Affiliation';
  sourceOrganization?: SourceOrganization;
  targetOrganization?: Organization | UnconfirmedOrganization;
}

export interface ImportContributor extends Omit<Contributor, 'type' | 'affiliations'> {
  type: 'ImportContributor';
  affiliations: ImportAffiliation[];
}

export interface ImportEntityDescription extends Omit<EntityDescription, 'type' | 'contributors'> {
  type: 'ImportEntityDescription';
  contributors: ImportContributor[];
}

export interface ImportCandidate {
  type: 'ImportCandidate';
  importStatus: ImportStatus;
  additionalIdentifiers?: AdditionalIdentifier[];
  associatedArtifacts: AssociatedArtifact[];
  associatedCustomers: string[];
  identifier: string;
  createdDate: string;
  modifiedDate: string;
  entityDescription: ImportEntityDescription;
}

export interface ExpandedImportCandidate extends Registration {
  type: 'ImportCandidate';
  importStatus: ImportStatus;
}

export type CollaborationType = 'Collaborative' | 'NonCollaborative';

export interface ImportCandidateAggregations extends Pick<
  RegistrationAggregations,
  'type' | 'topLevelOrganization' | 'files'
> {
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
