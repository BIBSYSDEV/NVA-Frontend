import { apiRequest2 } from '../../../api/apiRequest';
import { ApprovalSearchResponse } from '../approval.types';

const approvalPath = '/approval';

export const searchApprovals = async (query: string, signal?: AbortSignal) => {
  const searchApprovalsResponse = await apiRequest2<ApprovalSearchResponse>({
    url: approvalPath,
    params: { query },
    headers: { Accept: 'application/json' },
    signal,
  });
  return searchApprovalsResponse.data;
};
