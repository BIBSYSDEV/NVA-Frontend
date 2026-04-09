import { useSearchParams } from 'react-router';
import { getDefaultNviYear } from '../../utils/hooks/useNviCandidatesParams';
import { useFetchNviReports } from '../../api/hooks/useFetchNviReports';
import { useFilterInstitutionReportsByUrl } from './useFilterInstitutionReportsByUrl';
import { useSortInstitutionReportsByUrl } from './useSortInstitutionReportsByUrl';

export const useInstitutionReportsFilteredAndSortedByUrl = () => {
  const [searchParams] = useSearchParams();
  const yearParam = searchParams.get('year')?.trim();
  const parsedYear = yearParam ? Number(yearParam) : NaN;
  const year =
    Number.isInteger(parsedYear) && parsedYear >= 1000 && parsedYear <= 9999 ? parsedYear : getDefaultNviYear();
  const reportsQuery = useFetchNviReports({ year });
  const reports = reportsQuery.data?.institutions ?? [];
  const filteredData = useFilterInstitutionReportsByUrl(reports);
  const sortedAndFilteredData = useSortInstitutionReportsByUrl(filteredData);

  return { sortedAndFilteredData, isPending: reportsQuery.isPending, isError: reportsQuery.isError };
};
