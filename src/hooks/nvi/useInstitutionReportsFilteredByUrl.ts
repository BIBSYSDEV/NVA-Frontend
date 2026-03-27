import { useSearchParams } from 'react-router';
import { getNviInstitutionName } from '../../pages/basic_data/app_admin/nviAdmin/nviAdminHelpers';
import { InstitutionReport } from '../../types/nvi.types';
import { getDefaultNviYear } from '../../utils/hooks/useNviCandidatesParams';
import { useFetchNviReports } from '../../api/hooks/useFetchNviReports';

export const useInstitutionReportsFilteredByUrl = () => {
  const [searchParams] = useSearchParams();
  const yearParam = searchParams.get('year')?.trim();
  const parsedYear = yearParam ? Number(yearParam) : NaN;
  const year =
    Number.isInteger(parsedYear) && parsedYear >= 1000 && parsedYear <= 9999 ? parsedYear : getDefaultNviYear();
  const reportsQuery = useFetchNviReports({ year });
  const institutions = reportsQuery.data?.institutions ?? [];

  const selectedSector = searchParams.get('sector');
  const institutionSearch = searchParams.get('institution');

  const filteredData = institutions
    .filter((report: InstitutionReport) => selectedSector === null || report.sector === selectedSector)
    .filter((report: InstitutionReport) => {
      if (institutionSearch === null) return true;
      const trimmedSearch = institutionSearch.trim().toLowerCase();
      const trimmedInstitution = getNviInstitutionName(report).toLowerCase();
      return trimmedInstitution.includes(trimmedSearch);
    });

  return { filteredData, isPending: reportsQuery.isPending, isError: reportsQuery.isError };
};
