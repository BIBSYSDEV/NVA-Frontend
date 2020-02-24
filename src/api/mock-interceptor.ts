import Axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { Authority } from '../types/authority.types';
import OrcidResponse from '../types/orcid.types';
import { API_URL, ORCID_USER_INFO_URL } from '../utils/constants';
import mockDoiLookupResponse from '../utils/testfiles/doi_lookup_response.json';
import mockInstitutionResponse from '../utils/testfiles/institution_query.json';
import mockAuthoritiesResponse from '../utils/testfiles/mock_authorities_response.json';
import mockProjects from '../utils/testfiles/projects_real.json';
import mockPublication from '../utils/testfiles/publication_generated.json';
import mockPublications from '../utils/testfiles/publications_45_random_results_generated.json';
import mockMyPublications from '../utils/testfiles/my_publications.json';
import mockNsdPublisers from '../utils/testfiles/publishersFromNsd.json';
import mockCustomerInstitutions from '../utils/testfiles/mock_customer_institutions.json';
import { AuthorityApiPaths } from './authorityApi';
import { InstituionApiPaths } from './institutionApi';
import { ProjectsApiPaths } from './projectApi';
import { PublicationsApiPaths } from './publicationApi';
import { PublicationChannelApiPaths } from './publicationChannelApi';
import { FileUploadApiPaths } from './fileUploadApi';
import { CustomerInstituionApiPaths } from './customerInstitutionsApi';

const mockOrcidResponse: OrcidResponse = {
  id: 'https://sandbox.orcid.org/0000-0001-2345-6789',
  sub: '0000-0001-2345-6789',
  name: 'Sofia Garcia',
  family_name: 'Garcia',
  given_name: 'Sofia',
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

const mockSingleAuthorityResponse: Authority = {
  name: 'Test User',
  systemControlNumber: '901790000000',
  feideids: ['tu@unit.no'],
  orcids: [],
  orgunitids: [],
  handles: [],
  birthDate: '1941-04-25 00:00:00.000',
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

const mockSingleAuthorityResponseWithFirstOrgunitid: Authority = {
  name: 'Test User',
  systemControlNumber: '901790000000',
  feideids: ['osteloff@unit.no'],
  orcids: ['0000-0001-2345-6789'],
  orgunitids: ['194.0.0.0'],
  handles: [],
  birthDate: '1941-04-25 00:00:00.000',
};

const mockSingleAuthorityResponseWithSecondOrgunitid: Authority = {
  name: 'Test User',
  systemControlNumber: '901790000000',
  feideids: ['osteloff@unit.no'],
  orcids: ['0000-0001-2345-6789'],
  orgunitids: ['194.0.0.0', '194.16.0.0'],
  handles: [],
  birthDate: '1941-04-25 00:00:00.000',
};

const mockCreateUpload = { uploadId: 'asd', key: 'sfd' };
const mockPrepareUpload = { url: 'https://file-upload.com/files/' };
const mockCompleteUpload = {};

// AXIOS INTERCEPTOR
export const interceptRequestsOnMock = () => {
  const mock = new MockAdapter(Axios);

  // File Upload
  mock.onPost(new RegExp(FileUploadApiPaths.CREATE)).reply(200, mockCreateUpload);
  mock.onPost(new RegExp(FileUploadApiPaths.PREPARE)).reply(200, mockPrepareUpload);
  mock.onPost(new RegExp(FileUploadApiPaths.COMPLETE)).reply(200, mockCompleteUpload);

  //MY PUBLICATIONS
  mock.onGet(new RegExp(`${PublicationsApiPaths.FETCH_MY_RESOURCES}/*`)).reply(200, mockMyPublications);

  // WORKLIST
  mock.onGet(new RegExp(`${PublicationsApiPaths.DOI_REQUESTS}/*`)).reply(200, mockMyPublications);

  //PUBLICATION
  mock.onGet(new RegExp(`${PublicationsApiPaths.FETCH_RESOURCE}/*`)).reply(200, mockPublication);

  // Create publication from doi
  mock.onPost(new RegExp(`${PublicationsApiPaths.CREATE_WITH_DOI}`)).reply(200, mockPublications[0]);

  // lookup DOI
  mock.onPost(new RegExp(`${PublicationsApiPaths.DOI_LOOKUP}/*`)).reply(200, mockDoiLookupResponse);

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

  // update authority
  mock
    .onPut(new RegExp(`${API_URL}${AuthorityApiPaths.AUTHORITY}/*`))
    .replyOnce(200, mockSingleAuthorityResponseWithFeide);
  mock.onPut(new RegExp(`${API_URL}${AuthorityApiPaths.AUTHORITY}/*`)).replyOnce(200, mockSingleAuthorityResponse);
  mock
    .onPut(new RegExp(`${API_URL}${AuthorityApiPaths.AUTHORITY}/*`))
    .replyOnce(200, mockSingleAuthorityResponseWithOrcid);
  mock
    .onPut(new RegExp(`${API_URL}${AuthorityApiPaths.AUTHORITY}/*`))
    .replyOnce(200, mockSingleAuthorityResponseWithFirstOrgunitid);
  mock
    .onPut(new RegExp(`${API_URL}${AuthorityApiPaths.AUTHORITY}/*`))
    .reply(200, mockSingleAuthorityResponseWithSecondOrgunitid);

  // create authority
  mock.onPost(new RegExp(`${API_URL}${AuthorityApiPaths.AUTHORITY}/*`)).reply(200, mockSingleAuthorityResponse);

  //memberinstitutions
  mock
    .onGet(new RegExp(`${API_URL}${CustomerInstituionApiPaths.CUSTOMER_INSTITUTION}/*`))
    .reply(200, mockCustomerInstitutions);

  // Institution Registry
  mock.onGet(new RegExp(`${API_URL}${InstituionApiPaths.INSTITUTION}\\?name=*`)).reply(200, mockInstitutionResponse);

  // SEARCH
  mock.onGet(new RegExp(`${PublicationsApiPaths.SEARCH}/*`)).reply(200, mockPublications);

  mock.onAny().reply(function(config) {
    throw new Error('Could not find mock for ' + config.url);
  });
};
