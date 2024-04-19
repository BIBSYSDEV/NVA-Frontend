import { VerificationStatus } from '../types/contributor.types';
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
  User,
} from '../types/user.types';
import { ORCID_BASE_URL } from './constants';
import { getIdentifierFromId } from './general-helpers';

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

export const hasCuratorRole = (user: User | null) =>
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
