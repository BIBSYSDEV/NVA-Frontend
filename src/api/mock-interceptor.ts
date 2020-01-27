import Axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { Authority } from '../types/authority.types';
import OrcidResponse from '../types/orcid.types';
import { API_URL, ORCID_USER_INFO_URL } from '../utils/constants';
import mockDoiLookupResponse from '../utils/testfiles/doi_lookup_response.json';
import mockAuthoritiesResponse from '../utils/testfiles/mock_authorities_response.json';
import mockProjects from '../utils/testfiles/projects_real.json';
import mockPublications from '../utils/testfiles/publications_45_random_results_generated.json';
import mockNsdPublisers from '../utils/testfiles/publishersFromNsd.json';
import mockInstitutionResponse from '../utils/testfiles/institution_query.json';
import mockFacultyResponse from '../utils/testfiles/institution_faculty_query.json';
import mockInstituteResponse from '../utils/testfiles/institution_institute_query.json';
import { AuthorityApiPaths } from './authorityApi';
import { ProjectsApiPaths } from './projectApi';
import { InstituionApiPaths } from './institutionApi';
import { PublicationsApiPaths } from './publicationApi';
import { PublicationChannelApiPaths } from './publicationChannelApi';

const TOP_INSTITUTION_REGEXP = '[0-9]+.0.0.0';
const SUBUNIT_INSTITUTION_REGEXP = '*.[^0]+.0.0';

const mockOrcidResponse: OrcidResponse = {
  id: 'https://sandbox.orcid.org/0000-0001-2345-6789',
  sub: '0000-0001-2345-6789',
  name: 'Sofia Garcia',
  family_name: 'Garcia',
  given_name: 'Sofia',
};

const mockSingleAuthorityResponseWithOrcid: Authority = {
  name: 'Test User',
  systemControlNumber: '901790000000',
  feideids: ['osteloff@unit.no'],
  orcids: ['0000-0001-2345-6789'],
  orgunitids: [],
  handles: [],
  birthDate: '1941-04-25 00:00:00.000',
};

const mockSingleAuthorityResponse: Authority = {
  name: 'Test User',
  systemControlNumber: '901790000000',
  feideids: ['tu@unit.no'],
  orcids: [],
  orgunitids: ['220.0.0.0'],
  handles: [],
  birthDate: '1941-04-25 00:00:00.000',
};

const mockSingleAuthorityResponseWithFeide: Authority = {
  name: 'Test User',
  systemControlNumber: '901790000000',
  feideids: ['tu@unit.no'],
  orcids: [],
  orgunitids: [],
  handles: [],
  birthDate: '1941-04-25 00:00:00.000',
};
// AXIOS INTERCEPTOR
export const interceptRequestsOnMock = () => {
  const mock = new MockAdapter(Axios);

  // SEARCH
  mock.onGet(new RegExp(`${PublicationsApiPaths.SEARCH}/*`)).reply(200, mockPublications);

  // Create publication from doi
  mock.onPost(new RegExp(`${PublicationsApiPaths.CREATE_WITH_DOI}`)).reply(200, mockPublications[0]);

  // lookup DOI
  mock.onGet(new RegExp(`${PublicationsApiPaths.DOI_LOOKUP}/*`)).reply(200, mockDoiLookupResponse);

  // PROJECT
  mock.onGet(new RegExp(`${ProjectsApiPaths.PROJECTS}/*`)).reply(200, mockProjects);

  // PUBLICATION CHANNEL
  mock.onPost(new RegExp(`${API_URL}${PublicationChannelApiPaths.SEARCH}`)).reply(200, mockNsdPublisers);

  // ORCID
  mock.onPost(ORCID_USER_INFO_URL).reply(200, mockOrcidResponse);

  // Authority Registry
  mock.onGet(new RegExp(`${API_URL}${AuthorityApiPaths.AUTHORITY}\\?name=*`)).reply(200, mockAuthoritiesResponse);
  mock
    .onGet(new RegExp(`${API_URL}${AuthorityApiPaths.AUTHORITY}\\?name=tu@unit.no`))
    .reply(200, mockSingleAuthorityResponse);
  mock
    .onPut(new RegExp(`${API_URL}${AuthorityApiPaths.AUTHORITY}/*`))
    .replyOnce(200, mockSingleAuthorityResponseWithFeide);
  mock.onPut(new RegExp(`${API_URL}${AuthorityApiPaths.AUTHORITY}/*`)).replyOnce(200, mockSingleAuthorityResponse);
  mock
    .onPut(new RegExp(`${API_URL}${AuthorityApiPaths.AUTHORITY}/*`))
    .replyOnce(200, mockSingleAuthorityResponseWithOrcid);

  // Institution Registry
  mock.onGet(new RegExp(`${API_URL}${InstituionApiPaths.INSTITUTION}\\?name=*`)).reply(200, mockInstitutionResponse);
  mock
    .onGet(new RegExp(`${API_URL}${InstituionApiPaths.UNIT}${TOP_INSTITUTION_REGEXP}`))
    .reply(200, mockFacultyResponse);
  mock
    .onGet(new RegExp(`${API_URL}${InstituionApiPaths.UNIT}${SUBUNIT_INSTITUTION_REGEXP}`))
    .reply(200, mockInstituteResponse);

  mock.onAny().reply(function(config) {
    throw new Error('Could not find mock for ' + config.url);
  });
};
