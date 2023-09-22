import { LanguageString, SearchResponse } from './common.types';
import { PublicationInstanceType } from './registration.types';

interface NviCandidateContributor {
  id?: string;
  name: string;
}

export type NviCandidateStatus = 'Pending' | 'Rejected' | 'Approved';

interface NviCandidateSearchHitApproval {
  id: string;
  labels: LanguageString;
  approvalStatus: NviCandidateStatus;
}

export interface NviCandidateSearchHit {
  identifier: string;
  publicationDetails: {
    id: string;
    type: PublicationInstanceType;
    title: string;
    publicationDate: string;
    contributors: NviCandidateContributor[];
  };
  approvals: NviCandidateSearchHitApproval[];
  numberOfApprovals: number;
  points: number;
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

export interface ApprovalStatus {
  institutionId: string;
  status: NviCandidateStatus;
  points: number;
}

export interface NviCandidate {
  id: string;
  publicationId: string;
  approvalStatuses: ApprovalStatus[];
  notes: Note[];
}

export interface Note {
  createdDate: string;
  text: string;
  user: string;
}
