import { useFetchNviPeriodReport } from '../../../api/hooks/useFetchNviPeriodReport';
import { NviPeriodByGlobalApprovalStatus } from '../../../types/nvi.types';

export const getCandidatesForReporting = (globalApprovalStatus: NviPeriodByGlobalApprovalStatus | undefined) =>
  globalApprovalStatus
    ? globalApprovalStatus.pending + globalApprovalStatus.approved + globalApprovalStatus.rejected
    : undefined;

export const useNviPeriodReportNumbers = (year: number) => {
  const previousYear = year - 1;

  const periodReportQuery = useFetchNviPeriodReport({ year, hideErrorMessage: true });
  const periodReportPreviousYearQuery = useFetchNviPeriodReport({ year: previousYear, hideErrorMessage: true });

  const numCandidatesForReporting = getCandidatesForReporting(periodReportQuery.data?.byGlobalApprovalStatus);
  const numCandidatesForReportingPreviousYear = getCandidatesForReporting(
    periodReportPreviousYearQuery.data?.byGlobalApprovalStatus
  );

  const numApprovedByAll = periodReportQuery.data?.byGlobalApprovalStatus.approved;
  const numApprovedByAllPreviousYear = periodReportPreviousYearQuery.data?.byGlobalApprovalStatus.approved;

  const publicationPoints = periodReportQuery.data?.totals.validPoints;

  const percentageCandidatesComparedToPreviousYear =
    numCandidatesForReporting !== undefined &&
    numCandidatesForReportingPreviousYear !== undefined &&
    numCandidatesForReportingPreviousYear > 0
      ? Math.round((numCandidatesForReporting / numCandidatesForReportingPreviousYear) * 100)
      : undefined;

  const percentageApprovedComparedToPreviousYear =
    numApprovedByAll !== undefined && numApprovedByAllPreviousYear !== undefined && numApprovedByAllPreviousYear > 0
      ? Math.round((numApprovedByAll / numApprovedByAllPreviousYear) * 100)
      : undefined;

  return {
    numApprovedByAll,
    publicationPoints,
    numCandidatesForReporting,
    percentageCandidatesComparedToPreviousYear,
    percentageApprovedComparedToPreviousYear,
    isPending: periodReportQuery.isPending || periodReportPreviousYearQuery.isPending,
    isError: periodReportQuery.isError || periodReportPreviousYearQuery.isError,
  };
};
