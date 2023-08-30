import { LanguageString, SearchResponse } from './common.types';
import { PublicationInstanceType } from './registration.types';

interface NviCandidateContributor {
  id?: string;
  name: string;
}

export type NviCandidateStatus = 'PENDING' | 'REJECTED' | 'APPROVED';

interface NviCandidateAffiliation {
  id: string;
  labels: LanguageString;
  approvalStatus: NviCandidateStatus;
}

export interface NviCandidate {
  type: 'NviCandidate';
  identifier: string;
  year: string;
  publicationDetails: {
    id: string;
    type: PublicationInstanceType;
    title: string;
    publicationDate: string;
    contributors: NviCandidateContributor[];
  };
  affiliations: NviCandidateAffiliation[];
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
