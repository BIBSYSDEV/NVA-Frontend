import { ApprovalStatus, Note, NviCandidate, RejectedApprovalStatus } from '../types/nvi.types';
import { ScientificIndexApiPath } from './apiPaths';
import { authenticatedApiRequest2 } from './apiRequest';

export type CreateNoteData = Pick<Note, 'text'>;

export const createNote = async (candidateIdentifier: string, note: CreateNoteData) => {
  const createNoteResponse = await authenticatedApiRequest2<NviCandidate>({
    url: `${ScientificIndexApiPath.Candidate}/${candidateIdentifier}/note`,
    method: 'POST',
    data: note,
  });

  return createNoteResponse.data;
};

type ApproveNviCandidateData = Pick<ApprovalStatus, 'institutionId' | 'status'>;
export type SetNviCandidateStatusData = ApproveNviCandidateData & Partial<Pick<RejectedApprovalStatus, 'reason'>>;

export const setCandidateStatus = async (candidateIdentifier: string, data: SetNviCandidateStatusData) => {
  const setCandidateStatusResponse = await authenticatedApiRequest2<NviCandidate>({
    url: `${ScientificIndexApiPath.Candidate}/${candidateIdentifier}/status`,
    method: 'PUT',
    data: data,
  });

  return setCandidateStatusResponse.data;
};
