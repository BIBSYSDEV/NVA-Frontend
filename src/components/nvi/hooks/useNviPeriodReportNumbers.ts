import { useFetchNviPeriodReport } from '../../../api/hooks/useFetchNviPeriodReport';
import { NviPeriodByGlobalApprovalStatus } from '../../../types/nvi.types';
import { percentageOfAComparedToB } from '../../../utils/general-helpers/calculation-helpers';

export const getCandidatesForReporting = (globalApprovalStatus: NviPeriodByGlobalApprovalStatus | undefined) =>
  globalApprovalStatus
    ? globalApprovalStatus.pending + globalApprovalStatus.approved + globalApprovalStatus.rejected
    : undefined;

export const useNviPeriodReportNumbers = (year: number) => {
  const periodReportQuery = useFetchNviPeriodReport({ year, hideErrorMessage: true });
  const periodReportPreviousYearQuery = useFetchNviPeriodReport({ year: year - 1, hideErrorMessage: true });

  const numCandidatesForReporting = getCandidatesForReporting(periodReportQuery.data?.byGlobalApprovalStatus);
  const numCandidatesForReportingPreviousYear = getCandidatesForReporting(
    periodReportPreviousYearQuery.data?.byGlobalApprovalStatus
  );

  const numApprovedByAll = periodReportQuery.data?.byGlobalApprovalStatus.approved;
  const numApprovedByAllPreviousYear = periodReportPreviousYearQuery.data?.byGlobalApprovalStatus.approved;

  const publicationPoints = periodReportQuery.data?.totals.validPoints;

  const percentageCandidatesComparedToPreviousYear = percentageOfAComparedToB(
    numCandidatesForReporting,
    numCandidatesForReportingPreviousYear
  );

  const percentageApprovedComparedToPreviousYear = percentageOfAComparedToB(
    numApprovedByAll,
    numApprovedByAllPreviousYear
  );

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
