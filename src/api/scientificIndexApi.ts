import { Approval, Note, NviCandidate, NviPeriod, NviPeriodResponse, RejectedApproval } from '../types/nvi.types';
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

export type SetNviCandidateStatusData = Pick<Approval, 'institutionId' | 'status'> &
  Partial<Pick<RejectedApproval, 'reason'>>;

export const setCandidateStatus = async (candidateIdentifier: string, data: SetNviCandidateStatusData) => {
  const setCandidateStatusResponse = await authenticatedApiRequest2<NviCandidate>({
    url: `${ScientificIndexApiPath.Candidate}/${candidateIdentifier}/status`,
    method: 'PUT',
    data: data,
  });

  return setCandidateStatusResponse.data;
};

type SetAssigneeData = Pick<Approval, 'institutionId' | 'assignee'>;

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

export const fetchNviPeriods = async () => {
  const fetchNviPeriodsResponse = await authenticatedApiRequest2<NviPeriodResponse>({
    url: ScientificIndexApiPath.Period,
  });

  fetchNviPeriodsResponse.data.periods.sort((a, b) => +b.publishingYear - +a.publishingYear);
  return fetchNviPeriodsResponse.data;
};

export const fetchNviPeriod = async (year: number) => {
  const fetchNviPeriodsResponse = await authenticatedApiRequest2<NviPeriod>({
    url: `${ScientificIndexApiPath.Period}/${year}`,
  });
  return fetchNviPeriodsResponse.data;
};

export const createNviPeriod = async (data: NviPeriod) => {
  const createNviPeriodResponse = await authenticatedApiRequest2<NviPeriod>({
    url: ScientificIndexApiPath.Period,
    method: 'POST',
    data: data,
  });

  return createNviPeriodResponse.data;
};

export const updateNviPeriod = async (data: NviPeriod) => {
  const updateNviPeriodResponse = await authenticatedApiRequest2<NviPeriod>({
    url: ScientificIndexApiPath.Period,
    method: 'PUT',
    data: data,
  });

  return updateNviPeriodResponse.data;
};

export const fetchNviCandidateForRegistration = async (registrationId: string) => {
  const fetchNviCandidateForRegistrationResponse = await authenticatedApiRequest2<NviCandidate>({
    url: `${ScientificIndexApiPath.CandidateForRegistration}/${encodeURIComponent(registrationId)}`,
  });

  return fetchNviCandidateForRegistrationResponse.data;
};
