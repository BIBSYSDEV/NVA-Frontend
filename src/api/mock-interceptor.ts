import Axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { Authority } from '../types/authority.types';
import OrcidResponse from '../types/orcid.types';
import { API_URL, ORCID_USER_INFO_URL } from '../utils/constants';
import mockDoiLookupResponse from '../utils/testfiles/doi_lookup_response.json';
import mockInstitutionResponse from '../utils/testfiles/institutions/institution_query.json';
import mockUnitResponse from '../utils/testfiles/institutions/unit_response.json';
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

const mockSingleAuthorityResponseAfterDeletion: Authority = {
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
  orgunitids: ['194.65.20.10'],
  handles: [],
  birthDate: '1941-04-25 00:00:00.000',
};

const mockCreateUpload = { uploadId: 'asd', key: 'sfd' };
const mockPrepareUpload = { url: 'https://file-upload.com/files/' };
const mockCompleteUpload = {};

// AXIOS INTERCEPTOR
export const interceptRequestsOnMock = () => {
  const mock = new MockAdapter(Axios);

  // SEARCH
  mock.onGet(new RegExp(`${PublicationsApiPaths.SEARCH}/*`)).reply(200, mockPublications);

  // File Upload
  mock.onPost(new RegExp(FileUploadApiPaths.CREATE)).reply(200, mockCreateUpload);
  mock.onPost(new RegExp(FileUploadApiPaths.PREPARE)).reply(200, mockPrepareUpload);
  mock.onPost(new RegExp(FileUploadApiPaths.COMPLETE)).reply(200, mockCompleteUpload);

  //MY PUBLICATIONS
  mock.onGet(new RegExp(`${PublicationsApiPaths.PUBLICATIONS_BY_OWNER}/*`)).reply(200, mockMyPublications);

  // WORKLIST
  mock.onGet(new RegExp(`${PublicationsApiPaths.DOI_REQUESTS}/*`)).reply(200, mockMyPublications);
  mock.onGet(new RegExp(`${PublicationsApiPaths.FOR_APPROVAL}/*`)).reply(200, mockMyPublications);

  //PUBLICATION
  mock.onGet(new RegExp(`${PublicationsApiPaths.PUBLICATION}/*`)).reply(200, mockPublication);

  // lookup DOI
  mock.onPost(new RegExp(`${PublicationsApiPaths.DOI_LOOKUP}/*`)).reply(200, mockDoiLookupResponse);

  // PROJECT
  mock.onGet(new RegExp(`${ProjectsApiPaths.PROJECT}/*`)).reply(200, mockProjects);

  // PUBLICATION CHANNEL
  mock.onPost(new RegExp(`${API_URL}${PublicationChannelApiPaths.SEARCH}`)).reply(200, mockNsdPublisers);

  // ORCID
  mock.onPost(ORCID_USER_INFO_URL).reply(200, mockOrcidResponse);

  // Authority Registry
  mock.onGet(new RegExp(`${API_URL}${AuthorityApiPaths.PERSON}\\?name=*`)).reply(200, mockAuthoritiesResponse);
  mock
    .onGet(new RegExp(`${API_URL}${AuthorityApiPaths.PERSON}\\?name=tu@unit.no`))
    .reply(200, mockSingleAuthorityResponse);

  // update authority
  mock
    .onPut(new RegExp(`${API_URL}${AuthorityApiPaths.PERSON}/*`))
    .replyOnce(200, mockSingleAuthorityResponseWithFeide);
  mock
    .onPost(new RegExp(`${API_URL}${AuthorityApiPaths.PERSON}/901790000000/identifiers/orgunitid/*`))
    .replyOnce(200, mockSingleAuthorityResponse);
  mock
    .onPost(new RegExp(`${API_URL}${AuthorityApiPaths.PERSON}/901790000000/identifiers/orcid/*`))
    .reply(200, mockSingleAuthorityResponseWithOrcid);
  mock
    .onPost(new RegExp(`${API_URL}${AuthorityApiPaths.PERSON}/901790000000/identifiers/orgunitid/*`))
    .reply(200, mockSingleAuthorityResponseWithOrcid);

  // Remove orgunitid from Authority
  mock
    .onDelete(new RegExp(`${API_URL}${AuthorityApiPaths.PERSON}/*`))
    .reply(200, mockSingleAuthorityResponseAfterDeletion);

  // create authority
  mock.onPost(new RegExp(`${API_URL}${AuthorityApiPaths.PERSON}/*`)).reply(200, mockSingleAuthorityResponse);

  //memberinstitutions
  mock
    .onGet(new RegExp(`${API_URL}${CustomerInstituionApiPaths.CUSTOMER_INSTITUTION}/*`))
    .reply(200, mockCustomerInstitutions);

  // Institution Registry
  mock.onGet(new RegExp(`${API_URL}${InstituionApiPaths.INSTITUTION}\\?name=*`)).reply(200, mockInstitutionResponse);
  mock.onGet(new RegExp(`${API_URL}${InstituionApiPaths.INSTITUTION}\\?id=*`)).replyOnce(200, mockUnitResponse);
  // After deletion of institution
  mock.onGet(new RegExp(`${API_URL}${InstituionApiPaths.INSTITUTION}\\?id=*`)).replyOnce(200, []);

  mock.onAny().reply(function (config) {
    throw new Error('Could not find mock for ' + config.url);
  });
};
