import { ParseKeys } from 'i18next';
import { FetchResultsParams, ResultParam } from '../api/searchApi';
import { LanguageString, SearchResponse } from './common.types';
import { PublicationInstanceType, RegistrationDate } from './registration.types';

export enum ScientificIndexStatuses {
  Reported = 'Reported',
}

interface NviCandidateContributor {
  id?: string;
  name: string;
}

export type NviCandidateStatus = 'New' | 'Pending' | 'Rejected' | 'Approved';

interface NviCandidateSearchHitApproval {
  institutionId: string;
  labels: LanguageString;
  approvalStatus: NviCandidateStatus;
}

export interface NviCandidateSearchHit {
  identifier: string;
  publicationDetails: {
    id: string;
    type: PublicationInstanceType;
    title: string;
    publicationDate: Omit<RegistrationDate, 'type'>;
    nviContributors: NviCandidateContributor[];
    contributorsCount: number;
  };
  approvals: NviCandidateSearchHitApproval[];
  numberOfApprovals: number;
}

interface AggregationCount {
  docCount: number;
}

interface OrganizationDetail extends AggregationCount {
  dispute: AggregationCount;
  points: { total: { value: number } };
  status: { [status in NviCandidateStatus]?: AggregationCount };
}

export interface NviInstitutionStatusResponse {
  [organizationId: string]: OrganizationDetail;
}

export type NviCandidateSearchStatus = keyof NviCandidateAggregations;

interface NviCandidateAggregations {
  approved: AggregationCount;
  completed: AggregationCount;
  dispute: AggregationCount;
  pending: AggregationCount;
  rejected: AggregationCount;
  totalCount: AggregationCount;
}

export type NviCandidateSearchResponse = Omit<
  SearchResponse<NviCandidateSearchHit, NviCandidateAggregations>,
  'size' | 'processingTime'
> & {
  totalHits: number;
};

export interface Approval {
  institutionId: string;
  status: NviCandidateStatus;
  points: number;
  assignee?: string;
}

export interface FinalizedApproval extends Approval {
  status: 'Rejected' | 'Approved';
  finalizedBy: string;
  finalizedDate: string;
}

export interface RejectedApproval extends FinalizedApproval {
  status: 'Rejected';
  reason: string;
}

type NviAllowedOperation =
  | 'approval/reject-candidate'
  | 'approval/approve-candidate'
  | 'approval/reset-approval'
  | 'note/create-note';

export interface NviCandidateProblem {
  type: 'UnverifiedCreatorExists' | 'UnverifiedCreatorFromOrganizationProblem';
}

export interface NviCandidate {
  id: string;
  publicationId: string;
  approvals: (Approval | FinalizedApproval | RejectedApproval)[];
  notes: Note[];
  period: {
    status: 'OpenPeriod' | 'ClosedPeriod' | 'NoPeriod' | 'UnopenedPeriod';
    year?: string;
  };
  status?: 'Reported';
  allowedOperations: NviAllowedOperation[];
  problems: NviCandidateProblem[];
}

export interface Note {
  identifier: string;
  createdDate: string;
  text: string;
  user: string;
}

export interface NviPeriod {
  type: 'NviPeriod';
  publishingYear: string;
  reportingDate: string;
  startDate: string;
}

export interface NviPeriodResponse {
  periods: NviPeriod[];
}

export type CorrectionListId =
  | 'ApplicableCategoriesWithNonApplicableChannel'
  | 'NonApplicableCategoriesWithApplicableChannel'
  | 'AnthologyWithoutChapter'
  | 'AnthologyWithApplicableChapter'
  | 'BooksWithLessThan50Pages'
  | 'UnidentifiedContributorWithIdentifiedAffiliation';

export type CorrectionListSearchConfig = {
  [key in CorrectionListId]: {
    i18nKey: ParseKeys;
    queryParams: FetchResultsParams;
    disabledFilters: ResultParam[];
    topLevelOrganization: string | undefined;
  };
};

export enum NviSearchStatusEnum {
  CandidatesForControl = 'candidates_for_control',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

export type NviSearchStatus = `${NviSearchStatusEnum}`;
