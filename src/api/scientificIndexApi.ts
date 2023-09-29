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

export type SetNviCandidateStatusData = Pick<ApprovalStatus, 'institutionId' | 'status'> &
  Partial<Pick<RejectedApprovalStatus, 'reason'>>;

export const setCandidateStatus = async (candidateIdentifier: string, data: SetNviCandidateStatusData) => {
  const setCandidateStatusResponse = await authenticatedApiRequest2<NviCandidate>({
    url: `${ScientificIndexApiPath.Candidate}/${candidateIdentifier}/status`,
    method: 'PUT',
    data: data,
  });

  return setCandidateStatusResponse.data;
};

type SetAssigneeData = Pick<ApprovalStatus, 'institutionId' | 'assignee'>;

export const setCandidateAssignee = async (candidateIdentifier: string, data: SetAssigneeData) => {
  const setCandidateAssigneeResponse = await authenticatedApiRequest2<NviCandidate>({
    url: `${ScientificIndexApiPath.Candidate}/${candidateIdentifier}/assignee`,
    method: 'PUT',
    data: data,
  });

  return setCandidateAssigneeResponse.data;
};

export const deleteCandidateNote = async (candidateId: string, noteIdentifier: string) => {
  const deleteNoteResponse = await authenticatedApiRequest2<NviCandidate>({
    url: `${candidateId}/note/${noteIdentifier}`,
    method: 'DELETE',
  });

  return deleteNoteResponse.data;
};
