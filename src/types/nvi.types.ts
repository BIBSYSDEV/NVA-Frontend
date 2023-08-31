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

export interface NviCandidate {
  type: 'NviCandidate';
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

interface NviCandidateAggregations {
  'approvalStatus.rejected': {
    docCount: number;
  };
  'approvalStatus.approved': {
    docCount: number;
  };
  'approvalStatus.pending': {
    docCount: number;
  };
}

export type NviCandidateSearchResponse = SearchResponse<NviCandidate, NviCandidateAggregations>;
