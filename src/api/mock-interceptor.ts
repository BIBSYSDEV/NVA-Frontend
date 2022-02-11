import Axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { emptyRegistration } from '../types/registration.types';
import { ORCID_USER_INFO_URL } from '../utils/constants';
import mockDoiLookupResponse from '../utils/testfiles/doi_lookup_response.json';
import { mockAuthorities, mockOrcidResponse } from '../utils/testfiles/mockAuthorities';
import { mockRoles } from '../utils/testfiles/mock_feide_user';
import {
  mockCustomerInstitution,
  mockCustomerInstitutions,
  mockCustomerInstitutionVocabularies,
} from '../utils/testfiles/mockCustomerInstitutions';
import mockMyRegistrations from '../utils/testfiles/my_registrations.json';
import { mockProject, mockProjectSearch } from '../utils/testfiles/mockProjects';
import mockPublishedRegistrations from '../utils/testfiles/published_registrations.json';
import { mockPublishersSearch } from '../utils/testfiles/mockPublishers';
import { mockJournalsSearch } from '../utils/testfiles/mockJournals';
import { mockSearchResults, mockSearchWorklist } from '../utils/testfiles/mockSearchResults';
import { mockMessages, mockPublishedRegistration, mockRegistration } from '../utils/testfiles/mockRegistration';
import {
  SearchApiPath,
  FileApiPath,
  PublicationsApiPath,
  CristinApiPath,
  PublicationChannelApiPath,
  AuthorityApiPath,
  CustomerInstitutionApiPath,
  RoleApiPath,
  AlmaApiPath,
} from './apiPaths';
import { mockOrganizationSearch } from '../utils/testfiles/mockOrganizationSearch';
import { mockDownload, mockCreateUpload, mockPrepareUpload, mockCompleteUpload } from '../utils/testfiles/mockFiles';

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

  // PUBLICATION LIST
  mock.onGet(PublicationsApiPath.Registration).reply(200, mockPublishedRegistrations);

  //MY PUBLICATIONS
  mock.onGet(new RegExp(PublicationsApiPath.RegistrationsByOwner)).reply(200, mockMyRegistrations);

  //MY MESSAGES
  mock.onGet(new RegExp(PublicationsApiPath.Messages)).reply(200, mockMessages);
  mock.onGet(new RegExp(SearchApiPath.Messages)).reply(200, mockSearchWorklist);

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
    .reply(200, { ...emptyRegistration, owner: 'tu@unit.no' });
  mock
    .onGet(new RegExp(`${PublicationsApiPath.Registration}/${mockPublishedRegistration.identifier}`))
    .reply(200, mockPublishedRegistration);
  mock.onGet(new RegExp(PublicationsApiPath.Registration)).reply(200, mockRegistration);

  // lookup DOI
  mock.onPost(new RegExp(PublicationsApiPath.DoiLookup)).reply(200, mockDoiLookupResponse);

  // PROJECT
  mock.onGet(new RegExp(`${CristinApiPath.Project}/1`)).reply(200, mockProject);
  mock.onGet(new RegExp(CristinApiPath.Project)).reply(200, mockProjectSearch);

  // ORCID
  mock.onPost(ORCID_USER_INFO_URL).reply(200, mockOrcidResponse);

  // Authority Registry
  mock.onGet(new RegExp(`${AuthorityApiPath.Person}\\?name=*`)).reply(200, mockAuthorities);
  mock.onGet(new RegExp(`${AuthorityApiPath.Person}\\?feideid=*`)).reply(200, mockAuthorities);
  mock.onGet(new RegExp(`${AuthorityApiPath.Person}\\?arpId=901790000000`)).reply(200, mockAuthorities[1]);

  // update authority
  mock
    .onPost(new RegExp(`${AuthorityApiPath.Person}/901790000000/identifiers/*/update`))
    .replyOnce(200, mockAuthorities[1]);
  mock.onPost(new RegExp(`${AuthorityApiPath.Person}/901790000000/identifiers/orgunitid/add`)).replyOnce(200, {
    ...mockAuthorities[1],
    orgunitids: [...mockAuthorities[1].orgunitids, mockOrganizationSearch.hits[0].hasPart?.[0].id],
  });
  mock
    .onPost(new RegExp(`${AuthorityApiPath.Person}/901790000000/identifiers/orcid/add`))
    .reply(200, { ...mockAuthorities[1], orcids: ['https://sandbox.orcid.org/0000-0001-2345-6789'] });
  mock.onPost(new RegExp(`${AuthorityApiPath.Person}/901790000000/identifiers/orgunitid/add`)).reply(200, {
    ...mockAuthorities[1],
    orgunitids: [...mockAuthorities[1].orgunitids, 'https://api.dev.nva.aws.unit.no/cristin/organization/20754.1.0.0'],
  });

  // Remove orgunitid from Authority
  mock
    .onDelete(new RegExp(`${AuthorityApiPath.Person}/901790000000/identifiers/orgunitid/delete`))
    .reply(200, mockAuthorities[1]);

  // create authority
  mock.onPost(new RegExp(AuthorityApiPath.Person)).reply(200, mockAuthorities[1]);

  //memberinstitutions
  mock
    .onGet(new RegExp(`${CustomerInstitutionApiPath.Customer}/.+/vocabularies`))
    .reply(200, mockCustomerInstitutionVocabularies);
  mock.onGet(new RegExp(CustomerInstitutionApiPath.Customer)).replyOnce(200, mockCustomerInstitutions);
  mock.onGet(new RegExp(CustomerInstitutionApiPath.Customer)).reply(200, mockCustomerInstitution);
  mock.onPut(new RegExp(CustomerInstitutionApiPath.Customer)).reply(200, mockCustomerInstitution);
  mock.onPost(new RegExp(CustomerInstitutionApiPath.Customer)).reply(201, mockCustomerInstitution);

  // Organizations
  mock.onGet(new RegExp(`${CristinApiPath.Organization}\\?query=*`)).reply(200, mockOrganizationSearch);
  mock.onGet(mockOrganizationSearch.hits[0].id).reply(200, mockOrganizationSearch.hits[0]);
  mock.onGet(mockOrganizationSearch.hits[0].hasPart?.[0].id).reply(200, mockOrganizationSearch.hits[0].hasPart?.[0]);

  // Roles
  mock.onGet(new RegExp(RoleApiPath.InstitutionUsers)).reply(200, []);
  mock.onGet(new RegExp(RoleApiPath.Users)).reply(200, mockRoles);

  // Alma registrations
  mock.onGet(new RegExp(AlmaApiPath.Alma)).reply(200, undefined);

  mock.onAny().reply((config) => {
    throw new Error('Could not find mock for ' + config.url);
  });
};
