import { ApprovalSearchResponse } from '../types/approval.types';
import { ApprovalApiPath } from './apiPaths';
import { apiRequest2 } from './apiRequest';

/** Free text search in approvals. Matches title, approval identifiers (such as the DMP number) and id */
export const searchApprovals = async (query: string, signal?: AbortSignal) => {
  const searchApprovalsResponse = await apiRequest2<ApprovalSearchResponse>({
    url: ApprovalApiPath.Approval,
    params: { query },
    headers: { Accept: 'application/json' },
    signal,
  });
  return searchApprovalsResponse.data;
};
