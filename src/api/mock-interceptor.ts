import Axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { Authority } from '../types/authority.types';
import OrcidResponse from '../types/orcid.types';
import { API_URL, ORCID_USER_INFO_URL } from '../utils/constants';
import mockProjects from '../utils/testfiles/projects_real.json';
import mockDoiLookupResponse from '../utils/testfiles/doi_lookup_response.json';
import mockAuthoritiesResponse from '../utils/testfiles/mock_authorities_response.json';
import mockDoiPublication from '../utils/testfiles/publication_generated_from_doi.json';
import mockPublications from '../utils/testfiles/publications_45_random_results_generated.json';
import mockNsdPublisers from '../utils/testfiles/publishersFromNsd.json';
import { AuthorityApiPaths } from './authorityApi';
import { PublicationChannelApiPaths } from './publicationChannelApi';
import { PublicationsApiPaths } from './publicationApi';
import { ProjectsApiPaths } from './projectApi';

const mockOrcidResponse: OrcidResponse = {
  id: 'https://sandbox.orcid.org/0000-0001-2345-6789',
  sub: '0000-0001-2345-6789',
  name: 'Sofia Garcia',
  family_name: 'Garcia',
  given_name: 'Sofia',
};

const mockSingleAuthorityResponse: Authority = {
  name: 'Gundersen, Osteloff',
  scn: '901790000000',
  feideId: 'osteloff@ntnu.no',
  orcId: '0000-0001-2345-6789',
  handle: 'https://vg.no',
  birthDate: '1941-04-25 00:00:00.000',
};

// AXIOS INTERCEPTOR
export const interceptRequestsOnMock = () => {
  const mock = new MockAdapter(Axios);

  // SEARCH
  mock.onGet(new RegExp(`${PublicationsApiPaths.SEARCH}/*`)).reply(200, mockPublications);

  // Create publication from doi
  mock.onPost(new RegExp(`${PublicationsApiPaths.DOI}/*`)).reply(200, mockDoiPublication);

  // lookup DOI
  mock.onGet(new RegExp(`${PublicationsApiPaths.DOI_LOOKUP}/*`)).reply(200, mockDoiLookupResponse);

  // PROJECT
  mock.onGet(new RegExp(`${ProjectsApiPaths.PROJECTS}/*`)).reply(200, mockProjects);

  // PUBLICATION CHANNEL
  mock.onPost(new RegExp(`${API_URL}${PublicationChannelApiPaths.SEARCH}`)).reply(200, mockNsdPublisers);

  // ORCID
  mock.onPost(ORCID_USER_INFO_URL).reply(200, mockOrcidResponse);

  // Authority Registry
  mock.onPost(new RegExp(`${API_URL}${AuthorityApiPaths.AUTHORITY}`)).reply(200, mockAuthoritiesResponse);
  mock.onPut(new RegExp(`${API_URL}${AuthorityApiPaths.AUTHORITY}/*`)).reply(200, mockSingleAuthorityResponse);

  mock.onAny().reply(function(config) {
    throw new Error('Could not find mock for ' + config.url);
  });
};
