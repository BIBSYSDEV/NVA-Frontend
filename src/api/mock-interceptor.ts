import Axios, { AxiosRequestConfig } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { emptyRegistration } from '../types/registration.types';
import { ORCID_USER_INFO_URL } from '../utils/constants';
import { mockOrcidResponse } from '../utils/testfiles/mockAuthorities';
import { mockCristinPersonSearch } from '../utils/testfiles/mockCristinPersonSearch';
import {
  mockCustomerInstitution,
  mockCustomerInstitutionVocabularies,
  mockCustomerInstitutions,
} from '../utils/testfiles/mockCustomerInstitutions';
import { mockDoiLookup } from '../utils/testfiles/mockDoiLookup';
import { mockCompleteUpload, mockCreateUpload, mockPrepareUpload } from '../utils/testfiles/mockFiles';
import { mockJournalsSearch } from '../utils/testfiles/mockJournals';
import { mockMyRegistrations } from '../utils/testfiles/mockMyRegistrations';
import { mockNviCandidate } from '../utils/testfiles/mockNviCandidate';
import { mockOrganizationSearch } from '../utils/testfiles/mockOrganizationSearch';
import { mockPositionResponse } from '../utils/testfiles/mockPositions';
import { mockProject, mockProjectSearch } from '../utils/testfiles/mockProjects';
import { mockPublishersSearch } from '../utils/testfiles/mockPublishers';
import {
  mockDeletedRegistration,
  mockDeletedRegistrationProblem,
  mockPublishedRegistration,
  mockRegistration,
  mockTicketCollection,
} from '../utils/testfiles/mockRegistration';
import { mockSearchImportCandidates, mockSearchResults, mockSearchTasks } from '../utils/testfiles/mockSearchResults';
import { mockRoles, mockUser } from '../utils/testfiles/mock_feide_user';
import {
  CristinApiPath,
  CustomerInstitutionApiPath,
  FileApiPath,
  OrcidApiPath,
  PublicationChannelApiPath,
  PublicationsApiPath,
  RoleApiPath,
  SearchApiPath,
} from './apiPaths';

// AXIOS INTERCEPTOR
export const interceptRequestsOnMock = () => {
  const mock = new MockAdapter(Axios);

  // Scientific Index
  mock.onGet(new RegExp(SearchApiPath.NviCandidate)).reply(200, mockNviCandidate);

  // SEARCH
  mock.onGet(new RegExp(SearchApiPath.Registrations)).reply(200, mockSearchResults);
  mock.onGet(new RegExp(SearchApiPath.ImportCandidates)).reply(200, mockSearchImportCandidates);
  // File
  mock.onPost(new RegExp(FileApiPath.Create)).reply(200, mockCreateUpload);
  mock.onPost(new RegExp(FileApiPath.Prepare)).reply(200, mockPrepareUpload);
  mock.onPost(new RegExp(FileApiPath.Complete)).reply(200, mockCompleteUpload);

  //MY PUBLICATIONS
  mock.onGet(new RegExp(PublicationsApiPath.RegistrationsByOwner)).reply(200, mockMyRegistrations);

  //MY MESSAGES
  mock.onGet(new RegExp(SearchApiPath.CustomerTickets)).reply(200, mockSearchTasks);
  mock.onGet(new RegExp('/tickets')).reply(200, mockTicketCollection);

  // PUBLICATION CHANNEL
  mock.onGet(mockJournalsSearch.hits[0].id).reply(200, mockJournalsSearch.hits[0]);
  mock.onGet(mockJournalsSearch.hits[1].id).reply(200, mockJournalsSearch.hits[1]);
  mock.onGet(mockJournalsSearch.hits[2].id).reply(200, mockJournalsSearch.hits[2]);
  mock.onGet(new RegExp(PublicationChannelApiPath.Journal)).reply(200, mockJournalsSearch);
  mock.onGet(mockPublishersSearch.hits[0].id).reply(200, mockPublishersSearch.hits[0]);
  mock.onGet(mockPublishersSearch.hits[1].id).reply(200, mockPublishersSearch.hits[1]);
  mock.onGet(new RegExp(PublicationChannelApiPath.Publisher)).reply(200, mockPublishersSearch);

  //PUBLICATION
  mock.onPost(new RegExp(PublicationsApiPath.Registration)).reply(201, mockRegistration);
  mock.onGet(new RegExp(`${PublicationsApiPath.Registration}/4327439`)).reply(200, {
    ...emptyRegistration,
    publisher: { id: mockCustomerInstitution.id },
    resourceOwner: { owner: mockUser['custom:nvaUsername'] },
  });
  mock
    .onGet(new RegExp(`${PublicationsApiPath.Registration}/${mockPublishedRegistration.identifier}`))
    .reply(200, mockPublishedRegistration);
  mock
    .onGet(new RegExp(`${PublicationsApiPath.Registration}/${mockDeletedRegistration.identifier}`))
    .reply(410, mockDeletedRegistrationProblem);
  mock.onGet(new RegExp(PublicationsApiPath.Registration)).reply(200, mockRegistration);

  // lookup DOI
  mock.onPost(new RegExp(PublicationsApiPath.DoiLookup)).reply(200, mockDoiLookup);

  // PROJECT
  mock.onGet(mockProject.id).reply(200, mockProject);
  mock.onGet(mockProjectSearch.hits?.[1].id).reply(200, mockProjectSearch.hits?.[1]);
  mock.onGet(new RegExp(CristinApiPath.Project)).reply(200, mockProjectSearch);

  // ORCID
  mock.onPost(ORCID_USER_INFO_URL).reply(200, mockOrcidResponse);
  mock.onPost(new RegExp(OrcidApiPath.Orcid)).reply(201);

  // Person Registry
  mock.onGet(new RegExp(`${CristinApiPath.Person}\\?*`)).reply(200, mockCristinPersonSearch);
  mock.onPost(new RegExp(CristinApiPath.PersonIdentityNumber)).reply(201, mockCristinPersonSearch.hits[0]);
  mock.onGet(mockCristinPersonSearch.hits[0].id).reply(200, mockCristinPersonSearch.hits[0]);

  // Positions
  mock.onGet(new RegExp(CristinApiPath.Position)).reply(200, mockPositionResponse);

  //memberinstitutions
  mock
    .onGet(new RegExp(`${CustomerInstitutionApiPath.Customer}/.+/vocabularies`))
    .reply(200, mockCustomerInstitutionVocabularies);
  mock.onGet(new RegExp(`${CustomerInstitutionApiPath.Customer}/.+`)).reply(200, mockCustomerInstitution);
  mock.onGet(new RegExp(CustomerInstitutionApiPath.Customer)).reply(200, mockCustomerInstitutions);
  mock.onPut(new RegExp(CustomerInstitutionApiPath.Customer)).reply(200, mockCustomerInstitution);
  mock.onPost(new RegExp(CustomerInstitutionApiPath.Customer)).reply(201, mockCustomerInstitution);

  // Organizations
  mock.onGet(new RegExp(`${CristinApiPath.Organization}\\?query=*`)).reply(200, mockOrganizationSearch);
  mock.onGet(new RegExp(`${CristinApiPath.Organization}.*/persons.*`)).reply(200, mockCristinPersonSearch);
  mock.onGet(mockOrganizationSearch.hits[0].id).reply(200, mockOrganizationSearch.hits[0]);
  mock.onGet(mockOrganizationSearch.hits[0].hasPart?.[0].id).reply(200, mockOrganizationSearch.hits[0].hasPart?.[0]);

  // Roles
  mock.onGet(new RegExp(RoleApiPath.InstitutionUsers)).reply(200, []);
  mock.onGet(new RegExp(RoleApiPath.Users)).reply(200, mockRoles);

  mock.onAny().reply((config: AxiosRequestConfig) => {
    throw new Error('Could not find mock for ' + config.url);
  });
};
