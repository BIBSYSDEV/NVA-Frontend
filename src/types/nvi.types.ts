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
  // assignments: AggregationCount;
  // completed: AggregationCount;
  // totalCount: AggregationCount;
}

export type NviCandidateSearchResponse = SearchResponse<NviCandidateSearchHit, NviCandidateAggregations>;

interface NviCandidateApproval {
  institutionId: string;
  status: NviCandidateStatus;
}

interface NviCandidatePoint {
  institutionId: string;
  points: number;
}

export interface NviCandidate {
  id: string;
  publicationId: string;
  approvalStatuses: NviCandidateApproval[];
  points: NviCandidatePoint[];
  notes: any[];
}
