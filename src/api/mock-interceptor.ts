import Axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Authority } from '../types/authority.types';
import OrcidResponse from '../types/orcid.types';
import { emptyRegistration } from '../types/registration.types';
import { API_URL, ORCID_USER_INFO_URL } from '../utils/constants';
import mockDoiLookupResponse from '../utils/testfiles/doi_lookup_response.json';
import mockNtnuResponse from '../utils/testfiles/institutions/institution_ntnu.json';
import mockInstitutionResponse from '../utils/testfiles/institutions/institution_query.json';
import mockNtnuSubunitResponse from '../utils/testfiles/institutions/institution_subunit_ntnu.json';
import { mockSchoolOfSportDepartment } from '../utils/testfiles/institutions/school_of_sport_department';
import mockAuthoritiesResponse from '../utils/testfiles/mock_authorities_response.json';
import { mockRoles } from '../utils/testfiles/mock_feide_user';
import { mockCustomerInstitution, mockCustomerInstitutions } from '../utils/testfiles/mockCustomerInstitutions';
import {
  mockRegistrationsWithPendingDoiRequest,
  mockRegistrationWithPendingDoiRequest,
} from '../utils/testfiles/mockRegistration';
import mockMyRegistrations from '../utils/testfiles/my_registrations.json';
import mockProjects from '../utils/testfiles/projects_real.json';
import mockPublishedRegistrations from '../utils/testfiles/published_registrations.json';
import mockNsdPublisers from '../utils/testfiles/publishersFromNsd.json';
import { mockSearchResults } from '../utils/testfiles/search_results';
import { threeMockSearchResults } from '../utils/testfiles/three_search_results';
import { AuthorityApiPaths } from './authorityApi';
import { CustomerInstitutionApiPaths } from './customerInstitutionsApi';
import { FileApiPaths } from './fileApi';
import { InstitutionApiPaths } from './institutionApi';
import { ProjectsApiPaths } from './projectApi';
import { PublicationChannelApiPaths } from './publicationChannelApi';
import { PublicationsApiPaths } from './registrationApi';
import { RoleApiPaths } from './roleApi';
import { SearchApiPaths } from './searchApi';

const mockOrcidResponse: OrcidResponse = {
  id: 'https://sandbox.orcid.org/0000-0001-2345-6789',
  sub: '0000-0001-2345-6789',
  name: 'Sofia Garcia',
  family_name: 'Garcia',
  given_name: 'Sofia',
};

const mockSingleAuthorityResponse: Authority = {
  name: 'Test User',
  id: 'https://api.dev.nva.aws.unit.no/person/901790000000',
  feideids: ['tu@unit.no'],
  orcids: [],
  orgunitids: ['https://api.cristin.no/v2/units/150.4.1.0'],
  handles: [],
  birthDate: '1941-04-25 00:00:00.000',
};

const mockSingleAuthorityResponseWithOrcid: Authority = {
  ...mockSingleAuthorityResponse,
  orcids: ['0000-0001-2345-6789'],
  orgunitids: [...mockSingleAuthorityResponse.orgunitids, 'https://api.cristin.no/v2/units/194.65.20.10'],
};

const mockCreateUpload = { uploadId: 'asd', key: 'sfd' };
const mockPrepareUpload = { url: 'https://file-upload.com/files/' };
const mockCompleteUpload = {};

// AXIOS INTERCEPTOR
export const interceptRequestsOnMock = () => {
  const mock = new MockAdapter(Axios);

  // SEARCH
  mock.onGet(new RegExp(`${SearchApiPaths.REGISTRATIONS}/*`)).replyOnce(200, mockSearchResults);
  mock.onGet(new RegExp(`${SearchApiPaths.REGISTRATIONS}/*`)).reply(200, threeMockSearchResults);

  // File Upload
  mock.onPost(new RegExp(FileApiPaths.CREATE)).reply(200, mockCreateUpload);
  mock.onPost(new RegExp(FileApiPaths.PREPARE)).reply(200, mockPrepareUpload);
  mock.onPost(new RegExp(FileApiPaths.COMPLETE)).reply(200, mockCompleteUpload);

  // PUBLICATION LIST
  mock.onGet(PublicationsApiPaths.PUBLICATION).reply(200, mockPublishedRegistrations);

  //MY PUBLICATIONS
  mock.onGet(new RegExp(`${PublicationsApiPaths.PUBLICATIONS_BY_OWNER}/*`)).reply(200, mockMyRegistrations);

  // WORKLIST
  mock.onGet(new RegExp(`${PublicationsApiPaths.DOI_REQUEST}/*`)).reply(200, mockRegistrationsWithPendingDoiRequest);
  mock.onGet(new RegExp(`${PublicationsApiPaths.FOR_APPROVAL}/*`)).reply(200, mockMyRegistrations.publications);

  //MY MESSAGES
  mock
    .onGet(new RegExp(`${PublicationsApiPaths.DOI_REQUEST}?role=Creator`))
    .reply(200, mockRegistrationsWithPendingDoiRequest);

  //PUBLICATION
  mock.onGet(new RegExp(`${PublicationsApiPaths.PUBLICATION}/new`)).reply(200, emptyRegistration);
  mock
    .onGet(new RegExp(`${PublicationsApiPaths.PUBLICATION}/4327439`))
    .reply(200, { ...emptyRegistration, owner: 'tu@unit.no' });
  mock.onGet(new RegExp(`${PublicationsApiPaths.PUBLICATION}/*`)).reply(200, mockRegistrationWithPendingDoiRequest);

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
    .replyOnce(200, mockSingleAuthorityResponse);
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
    .reply(200, mockSingleAuthorityResponse);

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
    .onGet(new RegExp(`${API_URL}${InstitutionApiPaths.DEPARTMENTS}\\?uri=.*194&language=.*`))
    .reply(200, mockNtnuResponse);
  mock
    .onGet(new RegExp(`${API_URL}${InstitutionApiPaths.DEPARTMENTS}\\?uri=.*194.65.20.10&language=.*`))
    .reply(200, mockNtnuSubunitResponse);
  mock
    .onGet(new RegExp(`${API_URL}${InstitutionApiPaths.DEPARTMENTS}\\?uri=.*150.4.1.0&language=.*`))
    .reply(200, mockSchoolOfSportDepartment);

  // Roles
  mock.onGet(new RegExp(`${API_URL}${RoleApiPaths.INSTITUTION_USERS}/*`)).reply(200, []);
  mock.onGet(new RegExp(`${API_URL}${RoleApiPaths.USERS}/*`)).reply(200, mockRoles);

  mock.onAny().reply(function (config) {
    throw new Error('Could not find mock for ' + config.url);
  });
};
