import {
  CristinArrayValue,
  CristinPersonAffiliation,
  CristinPersonIdentifier,
  CristinPersonIdentifierType,
  CristinPersonNameType,
} from '../types/user.types';
import { ORCID_BASE_URL } from './constants';

const getValueByKey = (key: CristinPersonIdentifierType | CristinPersonNameType, items?: CristinArrayValue[]) =>
  items?.find((item) => item.type === key)?.value ?? '';

export const getFullCristinName = (names: CristinArrayValue[]) =>
  `${getValueByKey('FirstName', names)} ${getValueByKey('LastName', names)}`;

export const filterActiveAffiliations = (affiliations: CristinPersonAffiliation[]) =>
  affiliations.filter((affiliation) => affiliation.active);

export const getOrcidUri = (identifiers: CristinPersonIdentifier[] = []) => {
  const orcid = getValueByKey('ORCID', identifiers);
  return orcid ? `${ORCID_BASE_URL}/${orcid}` : '';
};
