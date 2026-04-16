import { useFetchNviInstitutionStatus } from '../../api/hooks/useFetchNviStatus';

export const useNviCandidateStatusNumbers = (year: number) => {
  const nviStatusQuery = useFetchNviInstitutionStatus(year);
  const nviStatusLastYearQuery = useFetchNviInstitutionStatus(year - 1);
  const candidateCount = nviStatusQuery.data?.totals.candidateCount;
  const candidateCountLastYear = nviStatusLastYearQuery.data?.totals.candidateCount;
  const percentageComparedToYearBefore =
    candidateCount !== undefined && candidateCountLastYear !== undefined && candidateCountLastYear > 0
      ? Math.round((candidateCount / candidateCountLastYear) * 100)
      : undefined;

  return {
    aggregations: nviStatusQuery.data,
    candidateCount,
    percentageComparedToYearBefore,
    isPending: nviStatusQuery.isPending || nviStatusLastYearQuery.isPending,
    isError: nviStatusQuery.isError || nviStatusLastYearQuery.isError,
  };
};
