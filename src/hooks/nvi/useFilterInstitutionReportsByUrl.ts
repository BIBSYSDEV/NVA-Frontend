import { useSearchParams } from 'react-router';
import { getNviInstitutionName } from '../../components/nvi/table/nvi-admin-table-helpers';
import { InstitutionReport } from '../../types/nvi.types';

export const useFilterInstitutionReportsByUrl = (reports: InstitutionReport[]) => {
  const [searchParams] = useSearchParams();

  const selectedSector = searchParams.get('sector');
  const institutionSearch = searchParams.get('institution');

  return reports
    .filter((report: InstitutionReport) => selectedSector === null || report.sector === selectedSector)
    .filter((report: InstitutionReport) => {
      if (institutionSearch === null) return true;
      const trimmedSearch = institutionSearch.trim().toLowerCase();
      const trimmedInstitution = getNviInstitutionName(report).toLowerCase();
      return trimmedInstitution.includes(trimmedSearch);
    });
};
