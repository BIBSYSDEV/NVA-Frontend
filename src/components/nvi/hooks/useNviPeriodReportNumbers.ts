import { useFetchNviPeriodReport } from '../../../api/hooks/useFetchNviPeriodReport';
import { NviPeriodByGlobalApprovalStatus } from '../../../types/nvi.types';

export const getCandidatesForReporting = (globalApprovalStatus: NviPeriodByGlobalApprovalStatus | undefined) =>
  globalApprovalStatus
    ? globalApprovalStatus.pending + globalApprovalStatus.approved + globalApprovalStatus.rejected
    : undefined;

export const useNviPeriodReportNumbers = (year: number) => {
  const reportingYear = Number(year);
  const previousYear = reportingYear - 1;

  const periodReportQuery = useFetchNviPeriodReport({ year: reportingYear, hideErrorMessage: true });
  const periodReportPreviousYearQuery = useFetchNviPeriodReport({ year: previousYear, hideErrorMessage: true });

  const numCandidatesForReporting = getCandidatesForReporting(periodReportQuery?.data?.byGlobalApprovalStatus);
  const numCandidatesForReportingPreviousYear = getCandidatesForReporting(
    periodReportPreviousYearQuery?.data?.byGlobalApprovalStatus
  );
  const percentageCandidatesComparedToPreviousYear =
    numCandidatesForReporting !== undefined &&
    numCandidatesForReportingPreviousYear !== undefined &&
    numCandidatesForReportingPreviousYear > 0
      ? Math.round((numCandidatesForReporting / numCandidatesForReportingPreviousYear) * 100)
      : undefined;

  return {
    numCandidatesForReporting,
    percentageCandidatesComparedToPreviousYear,
    isPending: periodReportQuery.isPending || periodReportPreviousYearQuery.isPending,
    isError: periodReportQuery.isError || periodReportPreviousYearQuery.isError,
  };
};
