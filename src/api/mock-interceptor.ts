import Axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { Authority } from '../types/authority.types';
import OrcidResponse from '../types/orcid.types';
import { API_URL, ORCID_USER_INFO_URL } from '../utils/constants';
import mockDoiLookupResponse from '../utils/testfiles/doi_lookup_response.json';
import mockInstitutionResponse from '../utils/testfiles/institutions/institution_query.json';
import mockNtnuResponse from '../utils/testfiles/institutions/institution_ntnu.json';
import mockNtnuSubunitResponse from '../utils/testfiles/institutions/institution_subunit_ntnu.json';
import mockAuthoritiesResponse from '../utils/testfiles/mock_authorities_response.json';
import mockProjects from '../utils/testfiles/projects_real.json';
import mockPublication from '../utils/testfiles/publication_generated.json';
import mockPublications from '../utils/testfiles/publications_45_random_results_generated.json';
import mockMyPublications from '../utils/testfiles/my_publications.json';
import mockNsdPublisers from '../utils/testfiles/publishersFromNsd.json';
import mockCustomerInstitutions from '../utils/testfiles/mock_customer_institutions.json';
import mockCustomerInstitution from '../utils/testfiles/mock_customer_institution.json';
import mockPublishedPublications from '../utils/testfiles/published_publications.json';
import { AuthorityApiPaths } from './authorityApi';
import { InstitutionApiPaths } from './institutionApi';
import { ProjectsApiPaths } from './projectApi';
import { PublicationsApiPaths } from './publicationApi';
import { PublicationChannelApiPaths } from './publicationChannelApi';
import { FileApiPaths } from './fileApi';
import { CustomerInstitutionApiPaths } from './customerInstitutionsApi';
import { emptyPublication } from '../types/publication.types';

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
  orgunitids: ['https://api.cristin.no/v2/units/194.65.20.10'],
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
  mock.onPost(new RegExp(FileApiPaths.CREATE)).reply(200, mockCreateUpload);
  mock.onPost(new RegExp(FileApiPaths.PREPARE)).reply(200, mockPrepareUpload);
  mock.onPost(new RegExp(FileApiPaths.COMPLETE)).reply(200, mockCompleteUpload);

  // PUBLICATION LIST
  mock.onGet(PublicationsApiPaths.PUBLICATION).reply(200, mockPublishedPublications);

  //MY PUBLICATIONS
  mock.onGet(new RegExp(`${PublicationsApiPaths.PUBLICATIONS_BY_OWNER}/*`)).reply(200, mockMyPublications);

  // WORKLIST
  mock.onGet(new RegExp(`${PublicationsApiPaths.DOI_REQUESTS}/*`)).reply(200, mockMyPublications.publications);
  mock.onGet(new RegExp(`${PublicationsApiPaths.FOR_APPROVAL}/*`)).reply(200, mockMyPublications.publications);

  //PUBLICATION
  mock.onGet(new RegExp(`${PublicationsApiPaths.PUBLICATION}/new`)).reply(200, emptyPublication);
  mock.onGet(new RegExp(`${PublicationsApiPaths.PUBLICATION}/4327439`)).reply(200, emptyPublication);
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
  mock
    .onGet(new RegExp(`${API_URL}${AuthorityApiPaths.PERSON}\\?arpId=901790000000`))
    .reply(200, mockSingleAuthorityResponse);

  // update authority
  mock
    .onPost(new RegExp(`${API_URL}${AuthorityApiPaths.PERSON}/901790000000/identifiers/*/update`))
    .replyOnce(200, mockSingleAuthorityResponseWithFeide);
  mock
    .onPost(new RegExp(`${API_URL}${AuthorityApiPaths.PERSON}/901790000000/identifiers/orgunitid/add`))
    .replyOnce(200, mockSingleAuthorityResponse);
  mock
    .onPost(new RegExp(`${API_URL}${AuthorityApiPaths.PERSON}/901790000000/identifiers/orcid/add`))
    .reply(200, mockSingleAuthorityResponseWithOrcid);
  mock
    .onPost(new RegExp(`${API_URL}${AuthorityApiPaths.PERSON}/901790000000/identifiers/orgunitid/add`))
    .reply(200, mockSingleAuthorityResponseWithOrcid);

  // Remove orgunitid from Authority
  mock
    .onDelete(new RegExp(`${API_URL}${AuthorityApiPaths.PERSON}/901790000000/identifiers/orgunitid/delete`))
    .reply(200, mockSingleAuthorityResponseAfterDeletion);

  // create authority
  mock.onPost(new RegExp(`${API_URL}${AuthorityApiPaths.PERSON}/*`)).reply(200, mockSingleAuthorityResponse);

  //memberinstitutions
  mock
    .onGet(new RegExp(`${API_URL}${CustomerInstitutionApiPaths.CUSTOMER_INSTITUTION}`))
    .replyOnce(200, mockCustomerInstitutions);
  mock
    .onGet(new RegExp(`${API_URL}${CustomerInstitutionApiPaths.CUSTOMER_INSTITUTION}/*`))
    .reply(200, mockCustomerInstitution);
  mock
    .onPut(new RegExp(`${API_URL}${CustomerInstitutionApiPaths.CUSTOMER_INSTITUTION}/*`))
    .reply(200, mockCustomerInstitution);
  mock
    .onPost(new RegExp(`${API_URL}${CustomerInstitutionApiPaths.CUSTOMER_INSTITUTION}`))
    .reply(201, mockCustomerInstitution);

  // Institution Registry
  mock.onGet(new RegExp(`${API_URL}${InstitutionApiPaths.INSTITUTIONS}`)).reply(200, mockInstitutionResponse);
  mock
    .onGet(new RegExp(`${API_URL}${InstitutionApiPaths.DEPARTMENTS}\\?uri=https://api.cristin.no/v2/institutions/194`))
    .replyOnce(200, mockNtnuResponse);
  mock
    .onGet(
      new RegExp(`${API_URL}${InstitutionApiPaths.DEPARTMENTS}\\?uri=https://api.cristin.no/v2/units/194.65.20.10`)
    )
    .replyOnce(200, mockNtnuSubunitResponse);

  mock.onAny().reply(function (config) {
    throw new Error('Could not find mock for ' + config.url);
  });
};
