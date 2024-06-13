import { CristinApiPath } from '../api/apiPaths';
import { ConfirmedAffiliation, Contributor } from '../types/contributor.types';
import { SimpleCustomerInstitution } from '../types/customerInstitution.types';
import { Organization } from '../types/organization.types';
import { API_URL } from './constants';
import { getLanguageString } from './translation-helpers';

// Find distinct unit URIs for a set of contributors' affiliations
const unitIdToIgnore = `${API_URL}${CristinApiPath.Organization.substring(1)}/0.0.0.0`;
export const getDistinctContributorUnits = (contributors: Contributor[]) => {
  const unitIds = contributors
    .flatMap((contributor) => contributor.affiliations)
    .filter((affiliation) => affiliation?.type === 'Organization' && affiliation.id !== unitIdToIgnore)
    .map((unit) => (unit as ConfirmedAffiliation).id);
  return [...new Set(unitIds)];
};

export const getOrganizationHierarchy = (unit?: Organization, result: Organization[] = []): Organization[] => {
  if (!unit) {
    return result;
  } else if (!unit.partOf || unit.partOf.length === 0) {
    return [unit, ...result];
  }

  // If some Organization has multiple values for partOf, this might produce wrong output
  return getOrganizationHierarchy(unit.partOf[0], [unit, ...result]);
};

export const findAncestor = (organization: Organization): Organization => {
  if (organization.partOf && organization.partOf.length > 0) {
    return findAncestor(organization.partOf[0]);
  }
  return organization;
};

export const findDescendantWithId = (organization: Organization, id: string) => {
  let descendant = null;

  if (organization.hasPart) {
    descendant = getAllChildOrganizations(organization.hasPart).find((des) => des.id === id) || null;
    console.log('descendant', descendant);
  }

  return descendant;
};

export const getSortedSubUnits = (subUnits: Organization[] = []) => {
  const units = getAllChildOrganizations(subUnits);
  return units.sort((a, b) => (getLanguageString(a.labels) < getLanguageString(b.labels) ? -1 : 1));
};

export const getAllChildOrganizations = (units: Organization[] = [], result: Organization[] = []): Organization[] => {
  if (!units.length) {
    return result;
  }
  const subUnits = units.flatMap((u) => u.hasPart ?? []);
  return getAllChildOrganizations(subUnits, [...result, ...units]);
};

export const getTopLevelOrganization = (organization: Organization): Organization =>
  !organization.partOf || organization.partOf.length === 0
    ? organization
    : getTopLevelOrganization(organization.partOf[0]);

export const sortCustomerInstitutions = <T extends SimpleCustomerInstitution>(customers: T[] = []) =>
  customers.sort((a, b) => (a.displayName?.toLocaleLowerCase() < b.displayName?.toLocaleLowerCase() ? -1 : 1));

export const getUnitTopLevelCode = (id = '') => {
  const identifier = id.split('/').pop() ?? '';
  const levelIdentifiers = identifier ? identifier.split('.') : [];
  const topLevel = levelIdentifiers.length > 0 ? levelIdentifiers[0] : null;
  return topLevel;
};
