import { useFetchNviInstitutionStatus } from '../../../api/hooks/useFetchNviStatus';
import { ApprovalStatusAggregation } from '../../../types/nvi.types';

export const getNumResults = (approvalStatus: ApprovalStatusAggregation | undefined) =>
  approvalStatus
    ? approvalStatus.New + approvalStatus.Pending + approvalStatus.Approved + approvalStatus.Rejected
    : undefined;

export const useNviStatusNumbers = (year: number) => {
  const yearBefore = year - 1;

  const nviStatusQuery = useFetchNviInstitutionStatus(year);
  const nviStatusYearBeforeQuery = useFetchNviInstitutionStatus(yearBefore);

  const approvalStatus = nviStatusQuery.data?.totals.approvalStatus;
  const approvalStatusYearBefore = nviStatusYearBeforeQuery.data?.totals.approvalStatus;

  const numResults = getNumResults(approvalStatus);
  const numResultsYearBefore = getNumResults(approvalStatusYearBefore);

  const percentageComparedToYearBefore =
    numResults && numResultsYearBefore && numResultsYearBefore > 0
      ? Math.round((numResults / numResultsYearBefore) * 100)
      : undefined;

  return {
    numResults,
    percentageComparedToYearBefore,
    statusData: nviStatusQuery.data,
    isPending: nviStatusQuery.isPending || nviStatusYearBeforeQuery.isPending,
    isError: nviStatusQuery.isError || nviStatusYearBeforeQuery.isError,
  };
};
