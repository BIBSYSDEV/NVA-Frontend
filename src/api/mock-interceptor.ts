import Axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { emptyRegistration } from '../types/registration.types';
import { ORCID_USER_INFO_URL } from '../utils/constants';
import { mockDoiLookup } from '../utils/testfiles/mockDoiLookup';
import { mockOrcidResponse } from '../utils/testfiles/mockAuthorities';
import { mockRoles, mockUser } from '../utils/testfiles/mock_feide_user';
import {
  mockCustomerInstitution,
  mockCustomerInstitutions,
  mockCustomerInstitutionVocabularies,
} from '../utils/testfiles/mockCustomerInstitutions';
import { mockMyRegistrations } from '../utils/testfiles/mockMyRegistrations';
import { mockProject, mockProjectSearch } from '../utils/testfiles/mockProjects';
import { mockPublishersSearch } from '../utils/testfiles/mockPublishers';
import { mockJournalsSearch } from '../utils/testfiles/mockJournals';
import { mockSearchResults, mockSearchWorklist } from '../utils/testfiles/mockSearchResults';
import { mockTicketCollection, mockPublishedRegistration, mockRegistration } from '../utils/testfiles/mockRegistration';
import {
  CristinApiPath,
  CustomerInstitutionApiPath,
  FileApiPath,
  PublicationChannelApiPath,
  PublicationsApiPath,
  RoleApiPath,
  SearchApiPath,
} from './apiPaths';
import { mockOrganizationSearch } from '../utils/testfiles/mockOrganizationSearch';
import { mockCompleteUpload, mockCreateUpload, mockDownload, mockPrepareUpload } from '../utils/testfiles/mockFiles';
import { mockCristinPersonSearch } from '../utils/testfiles/mockCristinPersonSearch';
import { mockPositionResponse } from '../utils/testfiles/mockPositions';

// AXIOS INTERCEPTOR
export const interceptRequestsOnMock = () => {
  const mock = new MockAdapter(Axios);

  // SEARCH
  mock.onGet(new RegExp(SearchApiPath.Registrations)).reply(200, mockSearchResults);

  // File
  mock.onGet(new RegExp(FileApiPath.Download)).reply(200, mockDownload);
  mock.onPost(new RegExp(FileApiPath.Create)).reply(200, mockCreateUpload);
  mock.onPost(new RegExp(FileApiPath.Prepare)).reply(200, mockPrepareUpload);
  mock.onPost(new RegExp(FileApiPath.Complete)).reply(200, mockCompleteUpload);

  //MY PUBLICATIONS
  mock.onGet(new RegExp(PublicationsApiPath.RegistrationsByOwner)).reply(200, mockMyRegistrations);

  //MY MESSAGES
  mock.onGet(new RegExp(PublicationsApiPath.Tickets)).reply(200, mockTicketCollection);
  mock.onGet(new RegExp(SearchApiPath.Tickets)).reply(200, mockSearchWorklist);

  // PUBLICATION CHANNEL
  mock.onGet(mockJournalsSearch[0].id).reply(200, mockJournalsSearch[0]);
  mock.onGet(mockJournalsSearch[1].id).reply(200, mockJournalsSearch[1]);
  mock.onGet(mockJournalsSearch[2].id).reply(200, mockJournalsSearch[2]);
  mock.onGet(new RegExp(PublicationChannelApiPath.JournalSearch)).reply(200, mockJournalsSearch);
  mock.onGet(mockPublishersSearch[0].id).reply(200, mockPublishersSearch[0]);
  mock.onGet(mockPublishersSearch[1].id).reply(200, mockPublishersSearch[1]);
  mock.onGet(new RegExp(PublicationChannelApiPath.PublisherSearch)).reply(200, mockPublishersSearch);

  //PUBLICATION
  mock.onPost(new RegExp(PublicationsApiPath.Registration)).reply(201, mockRegistration);
  mock
    .onGet(new RegExp(`${PublicationsApiPath.Registration}/4327439`))
    .reply(200, { ...emptyRegistration, resourceOwner: { owner: mockUser['custom:nvaUsername'] } });
  mock
    .onGet(new RegExp(`${PublicationsApiPath.Registration}/${mockPublishedRegistration.identifier}`))
    .reply(200, mockPublishedRegistration);
  mock.onGet(new RegExp(PublicationsApiPath.Registration)).reply(200, mockRegistration);

  // lookup DOI
  mock.onPost(new RegExp(PublicationsApiPath.DoiLookup)).reply(200, mockDoiLookup);

  // PROJECT
  mock.onGet(mockProject.id).reply(200, mockProject);
  mock.onGet(mockProjectSearch.hits?.[1].id).reply(200, mockProjectSearch.hits?.[1]);
  mock.onGet(new RegExp(CristinApiPath.Project)).reply(200, mockProjectSearch);

  // ORCID
  mock.onPost(ORCID_USER_INFO_URL).reply(200, mockOrcidResponse);

  // Person Registry
  mock.onGet(new RegExp(`${CristinApiPath.Person}\\?name=*`)).reply(200, mockCristinPersonSearch);
  mock.onPost(new RegExp(CristinApiPath.PersonIdentityNumer)).reply(201, mockCristinPersonSearch.hits[0]);
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
  mock.onGet(mockOrganizationSearch.hits[0].id).reply(200, mockOrganizationSearch.hits[0]);
  mock.onGet(mockOrganizationSearch.hits[0].hasPart?.[0].id).reply(200, mockOrganizationSearch.hits[0].hasPart?.[0]);

  // Roles
  mock.onGet(new RegExp(RoleApiPath.InstitutionUsers)).reply(200, []);
  mock.onGet(new RegExp(RoleApiPath.Users)).reply(200, mockRoles);

  mock.onAny().reply((config) => {
    throw new Error('Could not find mock for ' + config.url);
  });
};
