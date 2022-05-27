import {
  CreateCristinUser,
  CristinArrayValue,
  CristinPersonAffiliation,
  CristinPersonIdentifier,
  CristinPersonIdentifierType,
  CristinPersonNameType,
  CristinUser,
  FlatCristinUser,
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

export const convertToCristinUser = (user: FlatCristinUser): CreateCristinUser => ({
  identifiers: [{ type: 'NationalIdentificationNumber', value: user.nationalId }],
  names: [
    { type: 'FirstName', value: user.firstName },
    { type: 'LastName', value: user.lastName },
  ],
});

export const convertToFlatCristinUser = (user: CristinUser): FlatCristinUser => ({
  nationalId:
    getValueByKey('NationalIdentificationNumber', user.identifiers) || user.NationalIdentificationNumber || '',
  firstName: getValueByKey('FirstName', user.names),
  lastName: getValueByKey('LastName', user.names),
  id: user.id,
  cristinIdentifier: getValueByKey('CristinIdentifier', user.identifiers),
  affiliations: user.affiliations,
  orcid: getValueByKey('ORCID', user.identifiers),
});
