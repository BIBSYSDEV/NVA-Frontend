import { ApprovalIdentifier, ApprovalSearchResponse } from '../types/approval.types';
import { ApprovalApiPath } from './apiPaths';
import { apiRequest2 } from './apiRequest';

const searchApprovals = async (params: Record<string, string>, signal?: AbortSignal) => {
  const searchApprovalsResponse = await apiRequest2<ApprovalSearchResponse>({
    url: ApprovalApiPath.Approval,
    params,
    headers: { Accept: 'application/json' },
    signal,
  });
  return searchApprovalsResponse.data;
};

/** Free text search in approvals. Matches title, approval identifiers (such as the REK or DMP number) and id */
export const searchApprovalsByQuery = (query: string, signal?: AbortSignal) => searchApprovals({ query }, signal);

/** Searches for approvals with the given identifier, sent as "<name>:<value>", such as "REK:123456" */
export const searchApprovalsByIdentifier = (
  identifier: Pick<ApprovalIdentifier, 'name' | 'value'>,
  signal?: AbortSignal
) => searchApprovals({ identifier: `${identifier.name}:${identifier.value}` }, signal);
