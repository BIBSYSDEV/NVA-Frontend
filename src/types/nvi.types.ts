import { LanguageString, SearchResponse } from './common.types';
import { PublicationInstanceType } from './registration.types';

interface NviCandidateContributor {
  id?: string;
  name: string;
}

export type NviCandidateStatus = 'Pending' | 'Rejected' | 'Approved';

interface NviCandidateApproval {
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
  approvals: NviCandidateApproval[];
}

interface AggregationCount {
  docCount: number;
}

export interface NviCandidateAggregations {
  approved: AggregationCount;
  // approvedCollaboration: AggregationCount;
  // assigned: AggregationCount;
  // assignedCollaboration: AggregationCount;
  pending: AggregationCount;
  // pendingCollaboration: AggregationCount;
  rejected: AggregationCount;
  // rejectedCollaboration: AggregationCount;
  // assignments: AggregationCount;
  // completed: AggregationCount;
  // totalCount: AggregationCount;
}

export type NviCandidateSearchResponse = SearchResponse<NviCandidateSearchHit, NviCandidateAggregations>;

export interface NviCandidate {
  id: string;
  publicationId: string;
  approvalStatuses: any[];
  points: any[];
  notes: any[];
}
