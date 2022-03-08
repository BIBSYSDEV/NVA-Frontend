import {
  CristinArrayValue,
  CristinPersonAffiliation,
  CristinPersonIdentifierType,
  CristinPersonNameType,
} from '../types/user.types';

export const getValueByKey = (key: CristinPersonIdentifierType | CristinPersonNameType, items?: CristinArrayValue[]) =>
  items?.find((item) => item.type === key)?.value ?? '';

export const getFullCristinName = (names: CristinArrayValue[]) =>
  `${getValueByKey('FirstName', names)} ${getValueByKey('LastName', names)}`;

export const filterActiveAffiliations = (affiliations: CristinPersonAffiliation[]) => {
  return affiliations.filter((affiliation) => affiliation.active);
};
