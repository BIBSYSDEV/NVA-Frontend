import { Contributor } from '../types/contributor.types';
import { FormikInstitutionUnit, InstitutionUnitBase, RecursiveInstitutionUnit } from '../types/institution.types';

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
export const getDistinctContributorUnits = (contributors: Contributor[]) => {
  const unitIds = contributors
    .flatMap((contributor) => contributor.affiliations)
    .filter((affiliation) => !!affiliation?.id)
    .map((unit) => unit?.id) as string[];
  return [...new Set(unitIds)];
};

// Returns top-down unit names: ["Level1", "Level2", (etc.)]
export const getUnitHierarchyNames = (
  queryId: string,
  unit?: RecursiveInstitutionUnit,
  unitNames: string[] = []
): string[] => {
  if (!unit) {
    return unitNames;
  }
  unitNames.push(unit.name);

  if (queryId === unit.id || queryId === convertToInstitution(unit.id) || !unit.subunits) {
    return unitNames;
  } else {
    return getUnitHierarchyNames(queryId, unit.subunits[0], unitNames);
  }
};

// converts from https://api.cristin.no/v2/units/7482.3.3.0
//            to https://api.cristin.no/v2/institutions/7482
export const convertToInstitution = (unitId: string) => {
  if (unitId.includes('/institutions/')) {
    return unitId;
  } else {
    const id = unitId.split('https://api.cristin.no/v2/units/').pop();
    const institutionId = id?.split('.').reverse().pop();
    return `https://api.cristin.no/v2/institutions/${institutionId}`;
  }
};

export const sortInstitutionsAlphabetically = (institutions: InstitutionUnitBase[]) =>
  institutions.sort((institution1, institution2) => {
    if (institution1.name.toLocaleLowerCase() < institution2.name.toLocaleLowerCase()) {
      return -1;
    } else {
      return 1;
    }
  });
