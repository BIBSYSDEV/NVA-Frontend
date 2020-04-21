import { RecursiveInstitutionUnit } from '../types/institution.types';

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
