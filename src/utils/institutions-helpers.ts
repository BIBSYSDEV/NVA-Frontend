import { Contributor } from '../types/contributor.types';
import { Organization, RecursiveInstitutionUnit } from '../types/institution.types';
import { getLanguageString } from './translation-helpers';

// Find distinct unit URIs for a set of contributors' affiliations
const unitIdToIgnore = 'https://api.cristin.no/v2/units/0.0.0.0';
export const getDistinctContributorUnits = (contributors: Contributor[]) => {
  const unitIds = contributors
    .flatMap((contributor) => contributor.affiliations)
    .filter((affiliation) => !!affiliation?.id && affiliation.id !== unitIdToIgnore)
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

export const getOrganizationHierarchy = (unit?: Organization, result: Organization[] = []): Organization[] => {
  if (!unit) {
    return result;
  } else if (!unit.partOf) {
    return [unit, ...result];
  }

  // If some Organization has multiple values for partOf, this might produce wrong output
  return getOrganizationHierarchy(unit.partOf[0], [unit, ...result]);
};

export const getSortedSubUnits = (subUnits: Organization[] = []) => {
  const units = getAllChildOrganizations(subUnits);
  return units.sort((a, b) => (getLanguageString(a.name) < getLanguageString(b.name) ? -1 : 1));
};

const getAllChildOrganizations = (units: Organization[] = [], result: Organization[] = []): Organization[] => {
  if (!units.length) {
    return result;
  }
  const subUnits = units.flatMap((u) => u.hasPart ?? []);
  return getAllChildOrganizations(subUnits, [...result, ...units]);
};

// converts from https://api.cristin.no/v2/units/7482.3.3.0
//            to https://api.cristin.no/v2/institutions/7482
const convertToInstitution = (unitId: string) => {
  if (unitId.includes('/institutions/')) {
    return unitId;
  } else {
    const id = unitId.split('https://api.cristin.no/v2/units/').pop();
    const institutionId = id?.split('.').reverse().pop();
    return `https://api.cristin.no/v2/institutions/${institutionId}`;
  }
};
