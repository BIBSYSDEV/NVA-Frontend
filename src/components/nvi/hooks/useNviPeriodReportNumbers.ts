import { useFetchNviPeriodReport } from '../../../api/hooks/useFetchNviPeriodReport';
import { NviPeriodByGlobalApprovalStatus } from '../../../types/nvi.types';
import { percentageOfAComparedToB } from '../../../utils/general-helpers';

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
  const percentageCandidatesComparedToPreviousYear = percentageOfAComparedToB(
    numCandidatesForReporting,
    numCandidatesForReportingPreviousYear
  );

  return {
    numCandidatesForReporting,
    percentageCandidatesComparedToPreviousYear,
    isPending: periodReportQuery.isPending || periodReportPreviousYearQuery.isPending,
    isError: periodReportQuery.isError || periodReportPreviousYearQuery.isError,
  };
};
