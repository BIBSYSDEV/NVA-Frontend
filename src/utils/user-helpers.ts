import { VerificationStatus } from '../types/contributor.types';
import { Message, TicketType } from '../types/publication_types/ticket.types';
import { Registration } from '../types/registration.types';
import {
  CreateCristinPerson,
  CristinArrayValue,
  CristinPerson,
  CristinPersonAffiliation,
  CristinPersonIdentifier,
  CristinPersonIdentifierType,
  CristinPersonNameType,
  Employment,
  FlatCristinPerson,
  RoleName,
  User,
  UserRole,
} from '../types/user.types';
import { ORCID_BASE_URL } from './constants';
import { getIdentifierFromId } from './general-helpers';
import { isDegree } from './registration-helpers';

export const getValueByKey = (
  key: CristinPersonIdentifierType | CristinPersonNameType,
  items: CristinArrayValue[] = []
) => items.find((item) => item.type === key)?.value ?? '';

export const getFullCristinName = (names: CristinArrayValue[] = []) => {
  const firstName = getValueByKey('FirstName', names);
  const lastName = getValueByKey('LastName', names);
  const preferredFirstName = getValueByKey('PreferredFirstName', names);
  const preferredLastName = getValueByKey('PreferredLastName', names);

  return getFullName(preferredFirstName || firstName, preferredLastName || lastName);
};

export const filterActiveAffiliations = (affiliations: CristinPersonAffiliation[] = []) =>
  affiliations.filter((affiliation) => affiliation.active);

export const isActiveEmployment = (employment: Employment) => {
  const currentDate = new Date();
  return (
    new Date(employment.startDate) <= currentDate && (!employment.endDate || new Date(employment.endDate) > currentDate)
  );
};

export const getOrcidUri = (identifiers: CristinPersonIdentifier[] = []) => {
  const orcid = getValueByKey('ORCID', identifiers);
  return orcid ? `${ORCID_BASE_URL}/${orcid}` : '';
};

export const getVerificationStatus = (verifiedStatus: boolean | undefined) => {
  if (verifiedStatus) {
    return VerificationStatus.Verified;
  } else if (verifiedStatus === false) {
    return VerificationStatus.NotVerified;
  }
  return VerificationStatus.CannotBeEstablished;
};

export const getMaskedNationalIdentityNumber = (nationalIdentityNumber: string) =>
  nationalIdentityNumber ? nationalIdentityNumber.substring(0, 6).padEnd(11, '*') : '';

export const convertToCristinPerson = (user: FlatCristinPerson): CreateCristinPerson => ({
  identifiers: [{ type: 'NationalIdentificationNumber', value: user.nationalId }],
  names: [
    { type: 'FirstName', value: user.firstName },
    { type: 'LastName', value: user.lastName },
  ],
  employments: user.employments,
  nvi: user.nvi,
});

export const convertToFlatCristinPerson = (user: CristinPerson): FlatCristinPerson => ({
  nationalId: getValueByKey('NationalIdentificationNumber', user.identifiers),
  firstName: getValueByKey('FirstName', user.names),
  lastName: getValueByKey('LastName', user.names),
  preferredFirstName: getValueByKey('PreferredFirstName', user.names),
  preferredLastName: getValueByKey('PreferredLastName', user.names),
  id: user.id,
  cristinIdentifier: getValueByKey('CristinIdentifier', user.identifiers),
  affiliations: user.affiliations,
  employments: user.employments,
  orcid: getValueByKey('ORCID', user.identifiers),
  background: user.background,
  keywords: user.keywords,
  nvi: user.nvi,
});

export const getFullName = (firstName?: string, lastName?: string) => [firstName, lastName].filter(Boolean).join(' ');

export const isNviCurator = (user: User | null) => !!user && !!user.customerId && user.isNviCurator;

export const isPublishingCurator = (user: User | null) => !!user && !!user.customerId && user.isPublishingCurator;

export const isThesisCurator = (user: User | null) => !!user && !!user.customerId && user.isThesisCurator;

export const isDoiCurator = (user: User | null) => !!user && !!user.customerId && user.isDoiCurator;

export const isSupportCurator = (user: User | null) => !!user && !!user.customerId && user.isSupportCurator;

export const checkUserRoles = (user: User | null) => {
  return {
    isNviCurator: isNviCurator(user),
    isPublishingCurator: isPublishingCurator(user),
    isThesisCurator: isThesisCurator(user),
    isDoiCurator: isDoiCurator(user),
    isSupportCurator: isSupportCurator(user),
  };
};

export const hasCuratorRole = (user: User | null) =>
  !!user && !!user.customerId && (hasTicketCuratorRole(user) || user.isNviCurator);

export const hasTicketCuratorRole = (user: User | null) =>
  !!user &&
  !!user.customerId &&
  (user.isDoiCurator ||
    user.isPublishingCurator ||
    user.isSupportCurator ||
    user.isThesisCurator ||
    user.isEmbargoThesisCurator);

export const getUsername = (person?: CristinPerson | null, topOrgCristinId?: string) => {
  if (!person || !topOrgCristinId) {
    return '';
  }

  const personCristinIdentifier = getValueByKey('CristinIdentifier', person.identifiers);
  const topOrgCristinIdentifier = getIdentifierFromId(topOrgCristinId);

  if (!personCristinIdentifier || !topOrgCristinIdentifier) {
    return '';
  }

  return `${personCristinIdentifier}@${topOrgCristinIdentifier}`;
};

export const userCanDeleteMessage = (user: User, message: Message, ticketType: TicketType): boolean => {
  if (message.text) {
    if (user.nvaUsername === message.sender) {
      return true;
    }

    if (user.isPublishingCurator && (ticketType === 'PublishingRequest' || ticketType === 'UnpublishRequest')) {
      return true;
    }

    if (user.isThesisCurator && ticketType === 'FilesApprovalThesis') {
      return true;
    }

    if (user.isDoiCurator && ticketType === 'DoiRequest') {
      return true;
    }

    if (user.isSupportCurator && ticketType === 'GeneralSupportCase') {
      return true;
    }
  }

  return false;
};

export const isFileCuratorForRegistration = (user: User | null, registration?: Registration) => {
  if (!user || !registration?.entityDescription?.reference?.publicationInstance?.type) {
    return false;
  }

  if (isDegree(registration.entityDescription.reference.publicationInstance.type)) {
    return user.isThesisCurator;
  }

  return user.isPublishingCurator;
};

/**
 * Splits a CristinPerson's employments into internal and external based on the top organization Cristin ID.
 * @param cristinPerson - The CristinPerson object containing employments.
 * @param topOrgCristinId - The top organization Cristin ID used to determine internal employments.
 * @returns An object with arrays of `internalEmployments` and `externalEmployments`.
 */
export const getEmployments = (
  cristinPerson: CristinPerson | null | undefined,
  topOrgCristinId: string | undefined
) => {
  const internalEmployments: Employment[] = [];
  const externalEmployments: Employment[] = [];

  const employments = cristinPerson?.employments ?? [];
  const topOrgCristinIdentifier = topOrgCristinId ? getIdentifierFromId(topOrgCristinId) : '';
  const targetOrganizationIdStart = `${topOrgCristinIdentifier.split('.')[0]}.`;

  employments.forEach((employment) => {
    const organizationIdentifier = employment.organization.split('/').pop();
    if (organizationIdentifier?.startsWith(targetOrganizationIdStart)) {
      internalEmployments.push(employment);
    } else {
      externalEmployments.push(employment);
    }
  });

  return { internalEmployments, externalEmployments };
};

/**
 * Checks if a CristinPerson has a national identification number in their identifiers.
 * @param cristinPerson - The CristinPerson object to check.
 * @returns `true` if the person has a national identification number, otherwise `false`.
 */
export const checkIfPersonHasNationalIdentificationNumber = (cristinPerson: CristinPerson) => {
  return cristinPerson.identifiers.some(
    (identifier) => identifier.type === 'NationalIdentificationNumber' && Boolean(identifier.value)
  );
};

/**
 * Finds the first employment that matches an active affiliation by organization.
 * @param employments - Array of Employment objects to search.
 * @param affiliations - Array of CristinPersonAffiliation objects to match against.
 * @returns The first Employment object that matches an active affiliation, or `undefined` if none found.
 */
export const findFirstEmploymentThatMatchesAnActiveAffiliation = (
  employments?: Employment[],
  affiliations?: CristinPersonAffiliation[]
) => {
  return employments?.find((employment) =>
    affiliations?.some((affiliation) => affiliation.organization === employment.organization && affiliation.active)
  );
};

/**
 * Removes the `CuratorThesisEmbargo` role from the array if the user does not have the `CuratorThesis` role, because
 * you cannot have the CuratorThesisEmbargo role without having the CuratorThesis role.
 * If `CuratorThesis` is present, returns the roles unchanged.
 */
export const sanitizeRolesForEmbargoConstraint = (roles: UserRole[]) => {
  return !roles.some((role) => role.rolename === RoleName.CuratorThesis)
    ? roles.filter((role) => role.rolename !== RoleName.CuratorThesisEmbargo)
    : roles;
};
