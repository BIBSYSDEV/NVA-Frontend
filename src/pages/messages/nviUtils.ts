import {
  NviCandidateFilter,
  NviCandidateGlobalStatus,
  NviCandidateGlobalStatusEnum,
  NviCandidatesSearchParam,
  NviCandidateStatus,
  NviCandidateStatusEnum,
} from '../../api/searchApi';
import { NviCandidateSearchHitApproval, NviSearchStatus, NviSearchStatusEnum } from '../../types/nvi.types';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';

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

/*
 * Decides the value to display in the visibility filter dropdown based on the current status and globalStatus url attributes
 */
export const getVisibilityFilterValue = (
  status: NviCandidateStatus[] | null,
  globalStatus: NviCandidateGlobalStatus[] | null,
  filter: NviCandidateFilter | null
) => {
  /* We can only select a visibility filter when there is only one NVI status selected */
  if (status?.length === 1) {
    if (status?.includes('pending')) {
      if (filter === 'collaboration') {
        return filter;
      }
    } else if (status?.includes('approved') || status?.includes('rejected')) {
      if (globalStatus?.length === 1) {
        return globalStatus[0];
      }
    }
  }
  return '';
};

/* Takes in an object of url params, and some status- and filter values and returns necessary new param values to reflect the new filters */
export const updateParamsFromStatusAndFilterValues = (
  params: URLSearchParams,
  status: NviCandidateStatus[],
  globalStatus: NviCandidateGlobalStatus[],
  newFilter: NviCandidateFilter | NviCandidateGlobalStatus
) => {
  const newParams = new URLSearchParams(params);

  // Ensure options are only available when only one item in status dropdown is selected
  if (status?.length === 1) {
    if (status?.includes('pending')) {
      if (newFilter === 'collaboration') {
        newParams.set(NviCandidatesSearchParam.Filter, newFilter satisfies NviCandidateFilter);
      }
    } else if (status?.includes('approved')) {
      if (newFilter === 'approved' || newFilter === 'pending') {
        newParams.set(NviCandidatesSearchParam.GlobalStatus, newFilter satisfies NviCandidateGlobalStatus);
      } else {
        newParams.set(
          NviCandidatesSearchParam.GlobalStatus,
          ['approved' satisfies NviCandidateGlobalStatus, 'pending' satisfies NviCandidateGlobalStatus].join(',')
        );
      }
    } else if (status?.includes('rejected')) {
      if (newFilter === 'rejected' || newFilter === 'pending') {
        newParams.set(NviCandidatesSearchParam.GlobalStatus, newFilter satisfies NviCandidateGlobalStatus);
      } else {
        newParams.set(
          NviCandidatesSearchParam.GlobalStatus,
          ['rejected' satisfies NviCandidateGlobalStatus, 'pending' satisfies NviCandidateGlobalStatus].join(',')
        );
      }
    }
  }
  return newParams;
};

export const isOnlyPendingSelected = (
  status: NviCandidateStatus[] | null,
  globalStatus: NviCandidateGlobalStatus[] | null
) => {
  return (
    (status?.length === 1 &&
      status[0] === NviCandidateStatusEnum.Pending &&
      globalStatus?.length === 1 &&
      globalStatus[0] === NviCandidateGlobalStatusEnum.Pending) ??
    false
  );
};

export const isOnlyApprovedSelected = (
  status: NviCandidateStatus[] | null,
  globalStatus: NviCandidateGlobalStatus[] | null
) => {
  return (
    (status?.length === 1 &&
      status[0] === NviCandidateStatusEnum.Approved &&
      globalStatus &&
      globalStatus.length < 3 &&
      (globalStatus.includes(NviCandidateGlobalStatusEnum.Approved) ||
        globalStatus.includes(NviCandidateGlobalStatusEnum.Pending))) ??
    false
  );
};

export const isOnlyRejectedSelected = (
  status: NviCandidateStatus[] | null,
  globalStatus: NviCandidateGlobalStatus[] | null
) => {
  return (
    (status?.length === 1 &&
      status[0] === NviCandidateStatusEnum.Rejected &&
      globalStatus &&
      globalStatus.length < 3 &&
      (globalStatus.includes(NviCandidateGlobalStatusEnum.Rejected) ||
        globalStatus.includes(NviCandidateGlobalStatusEnum.Pending))) ??
    false
  );
};

/* Takes in a list of approvals and returns a line on the format "x of y approved" or similar depending on which page the user is on */
export const usePageSpecificAmountCount = (approvals: NviCandidateSearchHitApproval[]) => {
  const { t } = useTranslation();
  const location = useLocation();
  const isOnNviCandidatesPage = location.pathname === UrlPathTemplate.TasksNvi;
  const isOnNviDisputesPage = location.pathname === UrlPathTemplate.TasksNviDisputes;

  const approvedCount = approvals.filter(
    (a: NviCandidateSearchHitApproval) => a.approvalStatus === (NviCandidateStatusEnum.Approved as string)
  ).length;
  const rejectedCount = approvals.filter(
    (a: NviCandidateSearchHitApproval) => a.approvalStatus === (NviCandidateStatusEnum.Rejected as string)
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
