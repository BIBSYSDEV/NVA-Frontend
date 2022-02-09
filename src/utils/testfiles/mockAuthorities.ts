import { Authority } from '../../types/authority.types';
import { OrcidResponse } from '../../types/orcid.types';
import { mockOrganizationSearch } from './mockOrganizationSearch';

export const mockAuthorities: Authority[] = [
  {
    name: 'Osteloff, Oddny',
    id: 'https://api.dev.nva.aws.unit.no/person/900000000001',
    feideids: [],
    orcids: [],
    orgunitids: [],
    birthDate: '1991-01-01 00:00:00.000',
    handles: [],
  },
  {
    name: 'Test User',
    id: 'https://api.dev.nva.aws.unit.no/person/901790000000',
    feideids: ['tu@sikt.no'],
    orcids: [],
    orgunitids: [mockOrganizationSearch.hits[0].id],
    birthDate: '1950-01-01 00:00:00.000',
    handles: [],
  },
];

export const mockOrcidResponse: OrcidResponse = {
  id: 'https://sandbox.orcid.org/0000-0001-2345-6789',
  sub: '0000-0001-2345-6789',
  name: 'Sofia Garcia',
  family_name: 'Garcia',
  given_name: 'Sofia',
};
