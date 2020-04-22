import { RecursiveInstitutionUnit } from '../types/institution.types';

// Exclude institutions on any level (root, subunit, subunit of subunit, etc) that has a matching id in excludeIds
export const filterInstitutions = (
  institutions: RecursiveInstitutionUnit[],
  excludeIds: string[]
): RecursiveInstitutionUnit[] => {
  return institutions.filter((institution: RecursiveInstitutionUnit) => {
    if (institution.subunits) {
      institution.subunits = filterInstitutions(institution.subunits, excludeIds);
    }
    return !excludeIds.includes(institution.id);
  });
};
