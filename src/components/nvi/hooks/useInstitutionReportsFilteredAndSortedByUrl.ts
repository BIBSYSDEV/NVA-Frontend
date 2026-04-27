import { useFetchNviReports } from '../../../api/hooks/useFetchNviReports';
import { useFilterInstitutionReportsByUrl } from './helper-hooks/useFilterInstitutionReportsByUrl';
import { useSortInstitutionReportsByUrl } from './helper-hooks/useSortInstitutionReportsByUrl';

export const useInstitutionReportsFilteredAndSortedByUrl = (year: number) => {
  const reportsQuery = useFetchNviReports({ year });
  const reports = reportsQuery.data?.institutions ?? [];
  const filteredData = useFilterInstitutionReportsByUrl(reports);
  const sortedAndFilteredData = useSortInstitutionReportsByUrl(filteredData);

  return { sortedAndFilteredData, isPending: reportsQuery.isPending, isError: reportsQuery.isError };
};
