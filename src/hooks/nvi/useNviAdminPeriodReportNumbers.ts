import { useFetchNviPeriodReport } from '../../api/hooks/useFetchNviPeriodReport';

export const useNviAdminPeriodReportNumbers = (year: number) => {
  const reportQuery = useFetchNviPeriodReport({ year: year, hideErrorMessage: true });
  const reportQueryLastYear = useFetchNviPeriodReport({ year: year - 1, hideErrorMessage: true });
  const totalCount = reportQuery.data?.totals?.undisputedTotalCount;
  const validPoints = reportQuery.data?.totals?.validPoints;
  const totalCountLastYear = reportQueryLastYear.data?.totals?.undisputedTotalCount;
  const percentageComparedToYearBefore =
    totalCount && totalCountLastYear ? Math.round((totalCount / totalCountLastYear) * 100) : undefined;

  return {
    totalCount,
    percentageComparedToYearBefore,
    validPoints,
    isPending: reportQuery.isPending || reportQueryLastYear.isPending,
    isError: reportQuery.isError || reportQueryLastYear.isError,
  };
};
