import { useSearchParams } from 'react-router';
import { InstitutionReport } from '../../../types/nvi.types';
import { getNviInstitutionName } from '../table/utils/nvi-admin-aggregations-helpers';

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
