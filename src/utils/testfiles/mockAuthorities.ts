import { Authority } from '../../types/authority.types';
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
    id: 'https://api.dev.nva.aws.unit.no/person/900000000000',
    feideids: ['osteloff@unit.no'],
    orcids: ['https://sandbox.orcid.org/0000-0001-2345-6789'],
    orgunitids: [mockOrganizationSearch.hits[0].id],
    birthDate: '1950-01-01 00:00:00.000',
    handles: [],
  },
];
