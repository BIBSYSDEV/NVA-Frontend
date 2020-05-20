import { RecursiveInstitutionUnit, FormikInstitutionUnit, InstitutionUnitBase } from '../types/institution.types';
import { Contributor } from '../types/contributor.types';

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

// Find the most specific unit in hierarchy
export const getMostSpecificUnit = (values: FormikInstitutionUnit): InstitutionUnitBase => {
  if (values.subunit) {
    return getMostSpecificUnit(values.subunit);
  }
  return values as InstitutionUnitBase;
};

// Find distinct unit URIs for a set of contributors' affiliations
export const getDistinctContributorUnits = (contributors: Contributor[]) => [
  ...new Set(
    contributors
      .map((contributor) => contributor.affiliations)
      .flat()
      .filter((unit) => unit)
      .map((unit) => unit.id)
  ),
];

// Returns top-down unit names: ["Level1", "Level2", (etc.)]
export const getUnitHierarchyNames = (unit: RecursiveInstitutionUnit, unitNames: string[] = []): string[] => {
  unitNames.push(unit.name);
  if (unit.subunits) {
    return getUnitHierarchyNames(unit.subunits[0], unitNames);
  } else {
    return unitNames;
  }
};
