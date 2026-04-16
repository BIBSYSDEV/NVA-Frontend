import { useFetchNviInstitutionStatus } from '../../api/hooks/useFetchNviStatus';

export const useNviInstitutionStatusNumbers = (year: number) => {
  const nviStatusQuery = useFetchNviInstitutionStatus(year);
  const nviStatusLastYearQuery = useFetchNviInstitutionStatus(year - 1);
  const aggregations = nviStatusQuery.data;
  const aggregationsLastYear = nviStatusLastYearQuery.data;
  const numberApprovedComparedToLastYearPercentage =
    aggregations && aggregationsLastYear && aggregationsLastYear.totals.globalApprovalStatus.Approved > 0
      ? (aggregations.totals.globalApprovalStatus.Approved /
          aggregationsLastYear.totals.globalApprovalStatus.Approved) *
        100
      : undefined;
  const candidateCountComparedToLastYearPercentage =
    aggregations !== undefined && aggregationsLastYear !== undefined && aggregationsLastYear.totals.candidateCount > 0
      ? Math.round((aggregations.totals.candidateCount / aggregationsLastYear.totals.candidateCount) * 100)
      : undefined;

  return {
    aggregations,
    numberApprovedComparedToLastYearPercentage,
    candidateCountComparedToLastYearPercentage,
    isPending: nviStatusQuery.isPending || nviStatusLastYearQuery.isPending,
    isError: nviStatusQuery.isError || nviStatusLastYearQuery.isError,
  };
};
