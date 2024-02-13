import { LanguageString, SearchResponse } from './common.types';
import { PublicationInstanceType, RegistrationDate } from './registration.types';

interface NviCandidateContributor {
  id?: string;
  name: string;
}

type NviCandidateStatus = 'Pending' | 'Rejected' | 'Approved';

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
    contributors: NviCandidateContributor[];
  };
  approvals: NviCandidateSearchHitApproval[];
  numberOfApprovals: number;
}

interface AggregationCount {
  docCount: number;
}

export interface NviCandidateAggregations {
  approved: AggregationCount;
  approvedCollaboration: AggregationCount;
  assigned: AggregationCount;
  assignedCollaboration: AggregationCount;
  pending: AggregationCount;
  pendingCollaboration: AggregationCount;
  rejected: AggregationCount;
  rejectedCollaboration: AggregationCount;
  completed: AggregationCount;
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

export interface NviCandidate {
  id: string;
  publicationId: string;
  approvals: (Approval | FinalizedApproval | RejectedApproval)[];
  notes: Note[];
  period: {
    status: 'OpenPeriod' | 'ClosedPeriod' | 'NoPeriod';
  };
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

export interface CandidateOffsetState {
  currentOffset: number;
  nviQuery: string;
}
