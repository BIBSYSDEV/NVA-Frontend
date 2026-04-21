import { useFetchNviInstitutionStatus } from '../../../api/hooks/useFetchNviStatus';
import { ApprovalStatusAggregation } from '../../../types/nvi.types';

export const getTotalResults = (approvalStatus: ApprovalStatusAggregation | undefined) =>
  approvalStatus
    ? approvalStatus.New + approvalStatus.Pending + approvalStatus.Approved + approvalStatus.Rejected
    : undefined;

export const useNviReportNumbers = (year: number) => {
  const previousYear = year - 1;

  const nviStatusQuery = useFetchNviInstitutionStatus(year);
  const nviStatusPreviousYearQuery = useFetchNviInstitutionStatus(previousYear);

  const approvalStatus = nviStatusQuery.data?.totals.approvalStatus;
  const approvalStatusPreviousYear = nviStatusPreviousYearQuery.data?.totals.approvalStatus;

  const totalResults = getTotalResults(approvalStatus);
  const totalResultsPreviousYear = getTotalResults(approvalStatusPreviousYear);

  const percentageComparedToPreviousYear =
    totalResults !== undefined && totalResultsPreviousYear !== undefined && totalResultsPreviousYear > 0
      ? Math.round((totalResults / totalResultsPreviousYear) * 100)
      : undefined;

  return {
    totalResults,
    percentageComparedToPreviousYear: percentageComparedToPreviousYear,
    statusData: nviStatusQuery.data,
    isPending: nviStatusQuery.isPending || nviStatusPreviousYearQuery.isPending,
    isError: nviStatusQuery.isError || nviStatusPreviousYearQuery.isError,
  };
};
