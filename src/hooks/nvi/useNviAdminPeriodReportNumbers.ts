import { useFetchNviPeriodReport } from '../../api/hooks/useFetchNviPeriodReport';

export const useNviAdminPeriodReportNumbers = (year: number) => {
  const reportQuery = useFetchNviPeriodReport({ year, hideErrorMessage: true });
  const reportQueryLastYear = useFetchNviPeriodReport({ year: year - 1, hideErrorMessage: true });
  const totalCount = reportQuery.data?.totals?.undisputedTotalCount;
  const validPoints = reportQuery.data?.totals?.validPoints;
  const totalCountLastYear = reportQueryLastYear.data?.totals?.undisputedTotalCount;
  const percentageComparedToYearBefore =
    totalCount !== undefined && totalCountLastYear !== undefined && totalCountLastYear > 0
      ? Math.round((totalCount / totalCountLastYear) * 100)
      : undefined;

  return {
    totalCount,
    percentageComparedToYearBefore,
    validPoints,
    isPending: reportQuery.isPending || reportQueryLastYear.isPending,
    isError: reportQuery.isError || reportQueryLastYear.isError,
  };
};
