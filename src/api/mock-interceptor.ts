import Axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Authority } from '../types/authority.types';
import { OrcidResponse } from '../types/orcid.types';
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
import mockMyRegistrations from '../utils/testfiles/my_registrations.json';
import { mockProject, mockProjectSearch } from '../utils/testfiles/mockProjects';
import mockPublishedRegistrations from '../utils/testfiles/published_registrations.json';
import mockNsdPublisers from '../utils/testfiles/publishersFromNsd.json';
import { mockSearchResults } from '../utils/testfiles/search_results';
import { threeMockSearchResults } from '../utils/testfiles/three_search_results';
import { mockMessages, mockPublishedRegistration, mockRegistration } from '../utils/testfiles/mockRegistration';
import {
  SearchApiPath,
  FileApiPath,
  PublicationsApiPath,
  ProjectsApiPath,
  PublicationChannelApiPath,
  AuthorityApiPath,
  CustomerInstitutionApiPath,
  InstitutionApiPath,
  RoleApiPath,
  AlmaApiPath,
} from './apiPaths';

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
  orcids: ['https://sandbox.orcid.org/0000-0001-2345-6789'],
  orgunitids: [...mockSingleAuthorityResponse.orgunitids, 'https://api.cristin.no/v2/units/194.65.20.10'],
};

export const mockFileUploadUrl = 'https://localhost/api/file-upload/';
const mockCreateUpload = { uploadId: 'upoadId', key: 'key' };
const mockPrepareUpload = { url: mockFileUploadUrl };
const mockCompleteUpload = { location: '123-123-123' };
const mockDownload = { presignedDownloadUrl: 'https://localhost/api/file-download/' };

// AXIOS INTERCEPTOR
export const interceptRequestsOnMock = () => {
  const mock = new MockAdapter(Axios);

  // SEARCH
  mock.onGet(new RegExp(`${SearchApiPath.Registrations}/*`)).replyOnce(200, mockSearchResults);
  mock.onGet(new RegExp(`${SearchApiPath.Registrations}/*`)).reply(200, threeMockSearchResults);

  // File
  mock.onGet(new RegExp(FileApiPath.Download)).reply(200, mockDownload);
  mock.onPost(new RegExp(FileApiPath.Create)).reply(200, mockCreateUpload);
  mock.onPost(new RegExp(FileApiPath.Prepare)).reply(200, mockPrepareUpload);
  mock.onPost(new RegExp(FileApiPath.Complete)).reply(200, mockCompleteUpload);

  // PUBLICATION LIST
  mock.onGet(PublicationsApiPath.Registration).reply(200, mockPublishedRegistrations);

  //MY PUBLICATIONS
  mock.onGet(new RegExp(`${PublicationsApiPath.RegistrationsByOwner}/*`)).reply(200, mockMyRegistrations);

  //MY MESSAGES
  mock.onGet(new RegExp(`${PublicationsApiPath.Messages}`)).reply(200, mockMessages);

  //PUBLICATION
  mock.onPost(new RegExp(PublicationsApiPath.Registration)).reply(201, emptyRegistration);
  mock.onGet(new RegExp(`${PublicationsApiPath.Registration}/new`)).reply(200, emptyRegistration);
  mock
    .onGet(new RegExp(`${PublicationsApiPath.Registration}/4327439`))
    .reply(200, { ...emptyRegistration, owner: 'tu@unit.no' });
  mock
    .onGet(new RegExp(`${PublicationsApiPath.Registration}/${mockPublishedRegistration.identifier}`))
    .reply(200, mockPublishedRegistration);
  mock.onGet(new RegExp(`${PublicationsApiPath.Registration}/*`)).reply(200, mockRegistration);

  // lookup DOI
  mock.onPost(new RegExp(`${PublicationsApiPath.DoiLookup}/*`)).reply(200, mockDoiLookupResponse);

  // PROJECT
  mock.onGet(new RegExp(`${ProjectsApiPath.Project}/1`)).reply(200, mockProject);
  mock.onGet(new RegExp(`${ProjectsApiPath.Project}/*`)).reply(200, mockProjectSearch);

  // PUBLICATION CHANNEL
  mock.onPost(new RegExp(`${API_URL}${PublicationChannelApiPath.Search}`)).reply(200, mockNsdPublisers);

  // ORCID
  mock.onPost(ORCID_USER_INFO_URL).reply(200, mockOrcidResponse);

  // Authority Registry
  mock.onGet(new RegExp(`${API_URL}${AuthorityApiPath.Person}\\?name=*`)).reply(200, mockAuthoritiesResponse);
  mock
    .onGet(new RegExp(`${API_URL}${AuthorityApiPath.Person}\\?name=tu@unit.no`))
    .reply(200, mockSingleAuthorityResponse);
  mock
    .onGet(new RegExp(`${API_URL}${AuthorityApiPath.Person}\\?arpId=901790000000`))
    .reply(200, mockSingleAuthorityResponse);

  // update authority
  mock
    .onPost(new RegExp(`${API_URL}${AuthorityApiPath.Person}/901790000000/identifiers/*/update`))
    .replyOnce(200, mockSingleAuthorityResponse);
  mock
    .onPost(new RegExp(`${API_URL}${AuthorityApiPath.Person}/901790000000/identifiers/orgunitid/add`))
    .replyOnce(200, mockSingleAuthorityResponse);
  mock
    .onPost(new RegExp(`${API_URL}${AuthorityApiPath.Person}/901790000000/identifiers/orcid/add`))
    .reply(200, mockSingleAuthorityResponseWithOrcid);
  mock
    .onPost(new RegExp(`${API_URL}${AuthorityApiPath.Person}/901790000000/identifiers/orgunitid/add`))
    .reply(200, mockSingleAuthorityResponseWithOrcid);

  // Remove orgunitid from Authority
  mock
    .onDelete(new RegExp(`${API_URL}${AuthorityApiPath.Person}/901790000000/identifiers/orgunitid/delete`))
    .reply(200, mockSingleAuthorityResponse);

  // create authority
  mock.onPost(new RegExp(`${API_URL}${AuthorityApiPath.Person}/*`)).reply(200, mockSingleAuthorityResponse);

  //memberinstitutions
  mock.onGet(new RegExp(`${API_URL}${CustomerInstitutionApiPath.Customer}`)).replyOnce(200, mockCustomerInstitutions);
  mock.onGet(new RegExp(`${API_URL}${CustomerInstitutionApiPath.Customer}/*`)).reply(200, mockCustomerInstitution);
  mock.onPut(new RegExp(`${API_URL}${CustomerInstitutionApiPath.Customer}/*`)).reply(200, mockCustomerInstitution);
  mock.onPost(new RegExp(`${API_URL}${CustomerInstitutionApiPath.Customer}`)).reply(201, mockCustomerInstitution);

  // Institution Registry
  mock.onGet(new RegExp(`${API_URL}${InstitutionApiPath.Institutions}`)).reply(200, mockInstitutionResponse);
  mock
    .onGet(new RegExp(`${API_URL}${InstitutionApiPath.Departments}\\?uri=.*194&language=.*`))
    .reply(200, mockNtnuResponse);
  mock
    .onGet(new RegExp(`${API_URL}${InstitutionApiPath.Departments}\\?uri=.*194.65.20.10&language=.*`))
    .reply(200, mockNtnuSubunitResponse);
  mock
    .onGet(new RegExp(`${API_URL}${InstitutionApiPath.Departments}\\?uri=.*150.4.1.0&language=.*`))
    .reply(200, mockSchoolOfSportDepartment);

  // Roles
  mock.onGet(new RegExp(`${API_URL}${RoleApiPath.InstitutionUsers}/*`)).reply(200, []);
  mock.onGet(new RegExp(`${API_URL}${RoleApiPath.Users}/*`)).reply(200, mockRoles);

  // Alma registrations
  mock.onGet(new RegExp(`${API_URL}${AlmaApiPath.Alma}/*`)).reply(200, undefined);

  mock.onAny().reply(function (config) {
    throw new Error('Could not find mock for ' + config.url);
  });
};
