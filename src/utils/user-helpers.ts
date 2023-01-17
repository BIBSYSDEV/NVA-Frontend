import {
  CreateCristinPerson,
  CristinArrayValue,
  CristinPersonAffiliation,
  CristinPersonIdentifier,
  CristinPersonIdentifierType,
  CristinPersonNameType,
  CristinPerson,
  FlatCristinPerson,
  Employment,
} from '../types/user.types';
import { ORCID_BASE_URL } from './constants';

export const getValueByKey = (
  key: CristinPersonIdentifierType | CristinPersonNameType,
  items: CristinArrayValue[] = []
) => items.find((item) => item.type === key)?.value ?? '';

export const getFullCristinName = (names: CristinArrayValue[] = []) => {
  const firstName = getValueByKey('FirstName', names);
  const lastName = getValueByKey('LastName', names);
  const preferredFirstName = getValueByKey('PreferredFirstName', names);
  const preferredLastName = getValueByKey('PreferredLastName', names);

  if (preferredFirstName || preferredLastName) {
    return `${preferredFirstName} ${preferredLastName}`.trim();
  } else {
    return `${firstName} ${lastName}`.trim();
  }
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

export const getMaskedNationalIdentityNumber = (nationalIdentityNumber: string) =>
  nationalIdentityNumber ? nationalIdentityNumber.substring(0, 6).padEnd(11, '*') : '';

export const convertToCristinPerson = (user: FlatCristinPerson): CreateCristinPerson => ({
  identifiers: [{ type: 'NationalIdentificationNumber', value: user.nationalId }],
  names: [
    { type: 'FirstName', value: user.firstName },
    { type: 'LastName', value: user.lastName },
  ],
  employments: user.employments,
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
});
