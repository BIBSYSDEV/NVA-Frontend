import {
  NviCandidateGlobalStatus,
  NviCandidateGlobalStatusEnum,
  NviCandidateStatus,
  NviCandidateStatusEnum,
} from '../../api/searchApi';
import {
  NviCandidateSearchHitApproval,
  NviCandidateApprovalStatusEnum,
  NviSearchStatus,
  NviSearchStatusEnum,
} from '../../types/nvi.types';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { TFunction } from 'i18next';

/*
 * Takes in arrays of statuses extracted from two different url attributes and translates it into the state that
 * should be shown in the UI (the status filter dropdown)
 * */
export const computeDropdownStatusFromParams = (
  status: NviCandidateStatus[] | null,
  globalStatus: NviCandidateGlobalStatus[] | null
) => {
  const selectedOptions = [];

  if (
    status?.includes(NviCandidateStatusEnum.Pending) &&
    globalStatus?.includes(NviCandidateGlobalStatusEnum.Pending)
  ) {
    selectedOptions.push(NviSearchStatusEnum.CandidatesForControl);
  }
  if (
    status?.includes(NviCandidateStatusEnum.Approved) &&
    (globalStatus?.includes(NviCandidateGlobalStatusEnum.Approved) ||
      globalStatus?.includes(NviCandidateGlobalStatusEnum.Pending))
  ) {
    selectedOptions.push(NviSearchStatusEnum.Approved);
  }
  if (
    status?.includes(NviCandidateStatusEnum.Rejected) &&
    (globalStatus?.includes(NviCandidateGlobalStatusEnum.Rejected) ||
      globalStatus?.includes(NviCandidateGlobalStatusEnum.Pending))
  ) {
    selectedOptions.push(NviSearchStatusEnum.Rejected);
  }
  return selectedOptions;
};

/*
 * Takes in the state that is shown in the UI (the status filter dropdown) and translates it into
 * two different url attributes used for API query
 * */
export const computeParamsFromDropdownStatus = (dropdownStatus: NviSearchStatus[]) => {
  const newStatus = new Set<NviCandidateStatus>([]);
  const newGlobalStatus = new Set<NviCandidateGlobalStatus>([]);

  dropdownStatus.forEach((value) => {
    if (value === NviSearchStatusEnum.CandidatesForControl) {
      newStatus.add(NviCandidateStatusEnum.Pending);
      newGlobalStatus.add(NviCandidateGlobalStatusEnum.Pending);
    } else if (value === NviSearchStatusEnum.Approved) {
      newStatus.add(NviCandidateStatusEnum.Approved);
      newGlobalStatus.add(NviCandidateGlobalStatusEnum.Approved);
      newGlobalStatus.add(NviCandidateGlobalStatusEnum.Pending);
    } else if (value === NviSearchStatusEnum.Rejected) {
      newStatus.add(NviCandidateStatusEnum.Rejected);
      newGlobalStatus.add(NviCandidateGlobalStatusEnum.Rejected);
      newGlobalStatus.add(NviCandidateGlobalStatusEnum.Pending);
    }
  });

  return { newStatuses: Array.from(newStatus), newGlobalStatuses: Array.from(newGlobalStatus) };
};

/* Takes in a list of approvals and returns a line on the format "x of y approved" or similar depending on which page the user is on */
export const createPageSpecificAmountString = (
  t: TFunction,
  pathname: string,
  approvals: NviCandidateSearchHitApproval[]
) => {
  if (approvals.length === 0) {
    return '';
  }

  const isOnNviCandidatesPage = pathname === UrlPathTemplate.TasksNvi;
  const isOnNviDisputesPage = pathname === UrlPathTemplate.TasksNviDisputes;

  const approvedCount = approvals.filter(
    (a: NviCandidateSearchHitApproval) => a.approvalStatus === NviCandidateApprovalStatusEnum.Approved
  ).length;
  const rejectedCount = approvals.filter(
    (a: NviCandidateSearchHitApproval) => a.approvalStatus === NviCandidateApprovalStatusEnum.Rejected
  ).length;

  let approvalsCountLine = '';

  if (isOnNviDisputesPage) {
    approvalsCountLine = t('tasks.nvi.x_of_y_approved', {
      approved: approvedCount,
      total: approvals.length,
    });
  } else if (isOnNviCandidatesPage) {
    approvalsCountLine = t('tasks.nvi.x_of_y_controlled', {
      controlled: approvedCount + rejectedCount,
      total: approvals.length,
    });
  }

  return approvalsCountLine;
};
