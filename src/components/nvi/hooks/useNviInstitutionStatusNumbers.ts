import { useFetchNviInstitutionStatus } from '../../../api/hooks/useFetchNviStatus';
import { ApprovalStatusAggregation } from '../../../types/nvi.types';
import { percentageOfAComparedToB } from '../../../utils/general-helpers/calculation-helpers';

export const getTotalResults = (approvalStatus: ApprovalStatusAggregation | undefined) =>
  approvalStatus
    ? approvalStatus.New + approvalStatus.Pending + approvalStatus.Approved + approvalStatus.Rejected
    : undefined;

export const useNviInstitutionStatusNumbers = (year: number) => {
  const nviStatusQuery = useFetchNviInstitutionStatus(year);
  const nviStatusPreviousYearQuery = useFetchNviInstitutionStatus(year - 1);

  const totalResults = getTotalResults(nviStatusQuery.data?.totals.approvalStatus);
  const totalResultsPreviousYear = getTotalResults(nviStatusPreviousYearQuery.data?.totals.approvalStatus);

  const numApprovedByAll = nviStatusQuery.data?.totals.globalApprovalStatus.Approved;
  const numApprovedByAllPreviousYear = nviStatusPreviousYearQuery.data?.totals.globalApprovalStatus.Approved;

  return {
    totalResults,
    numApprovedByAll,
    publicationPoints: nviStatusQuery.data?.totals.points,
    percentageComparedToPreviousYear: percentageOfAComparedToB(totalResults, totalResultsPreviousYear),
    approvedByAllComparedToPreviousYear: percentageOfAComparedToB(numApprovedByAll, numApprovedByAllPreviousYear),
    statusData: nviStatusQuery.data,
    isPending: nviStatusQuery.isPending || nviStatusPreviousYearQuery.isPending,
    isError: nviStatusQuery.isError || nviStatusPreviousYearQuery.isError,
  };
};
