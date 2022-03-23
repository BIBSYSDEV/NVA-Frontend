import {
  CristinArrayValue,
  CristinPersonAffiliation,
  CristinPersonIdentifier,
  CristinPersonIdentifierType,
  CristinPersonNameType,
} from '../types/user.types';
import { ORCID_BASE_URL } from './constants';

export const getValueByKey = (
  key: CristinPersonIdentifierType | CristinPersonNameType,
  items: CristinArrayValue[] = []
) => items.find((item) => item.type === key)?.value ?? '';

export const getFullCristinName = (names: CristinArrayValue[] = []) => {
  const firstName = getValueByKey('FirstName', names);
  const lastName = getValueByKey('LastName', names);
  return [firstName, lastName].filter((name) => !!name).join(' ');
};

export const filterActiveAffiliations = (affiliations: CristinPersonAffiliation[] = []) =>
  affiliations.filter((affiliation) => affiliation.active);

export const getOrcidUri = (identifiers: CristinPersonIdentifier[] = []) => {
  const orcid = getValueByKey('ORCID', identifiers);
  return orcid ? `${ORCID_BASE_URL}/${orcid}` : '';
};
