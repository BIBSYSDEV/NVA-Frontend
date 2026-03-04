import { useSearchParams } from 'react-router';
import { InstitutionReport } from '../../types/nvi.types';
import { getDefaultNviYear } from '../../utils/hooks/useNviCandidatesParams';
import { getLanguageString } from '../../utils/translation-helpers';
import { useFetchNviReports } from './useFetchNviReports';

export const useGetUrlFilteredInstitutionReports = () => {
  const [searchParams] = useSearchParams();
  const yearParam = searchParams.get('year')?.trim();
  const year = yearParam ? Number(yearParam) : getDefaultNviYear();
  const reportsQuery = useFetchNviReports({ year });
  const institutions = reportsQuery.data?.institutions ?? [];

  const selectedSector = searchParams.get('sector');
  const institutionSearch = searchParams.get('institution');

  const filteredData = institutions
    .filter((report: InstitutionReport) => selectedSector === null || report.sector === selectedSector)
    .filter((report: InstitutionReport) => {
      if (institutionSearch === null) return true;
      const trimmedSearch = institutionSearch.trim().toLowerCase();
      const institutionName = getLanguageString(report.institution.labels);
      const trimmedInstitution = institutionName.trim().toLowerCase();
      return trimmedInstitution.includes(trimmedSearch);
    });

  return { filteredData, isPending: reportsQuery.isPending, isError: reportsQuery.isError };
};
