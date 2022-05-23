import { CristinApiPath } from '../api/apiPaths';
import { Contributor } from '../types/contributor.types';
import { SimpleCustomerInstitution } from '../types/customerInstitution.types';
import { Organization } from '../types/organization.types';
import { API_URL } from './constants';
import { getLanguageString } from './translation-helpers';

// Find distinct unit URIs for a set of contributors' affiliations
const unitIdToIgnore = `${API_URL}${CristinApiPath.Organization.substring(1)}/0.0.0.0`;
export const getDistinctContributorUnits = (contributors: Contributor[]) => {
  const unitIds = contributors
    .flatMap((contributor) => contributor.affiliations)
    .filter((affiliation) => !!affiliation?.id && affiliation.id !== unitIdToIgnore)
    .map((unit) => unit?.id) as string[];
  return [...new Set(unitIds)];
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

export const getTopLevelOrganization = (organization: Organization): Organization =>
  !organization.partOf ? organization : getTopLevelOrganization(organization.partOf[0]);

export const sortCustomerInstitutions = <T extends SimpleCustomerInstitution>(customers: T[] = []) =>
  customers.sort((a, b) => (a.displayName.toLocaleLowerCase() < b.displayName.toLocaleLowerCase() ? -1 : 1));
