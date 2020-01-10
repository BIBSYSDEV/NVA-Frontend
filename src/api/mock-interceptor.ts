import Axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import OrcidResponse from '../types/orcid.types';
import { ApplicationName, FeideUser, RoleName } from '../types/user.types';
import {
  API_URL,
  ApiServiceUrl,
  AUTHORITY_REGISTER_API_URL,
  ORCID_USER_INFO_URL,
  USE_MOCK_DATA,
} from '../utils/constants';
import mockProjects from '../utils/testfiles/cristin_projects_real.json';
import mockDoiLookupResponse from '../utils/testfiles/doi_lookup_response.json';
import mockAuthoritiesResponse from '../utils/testfiles/mock_authorities_response.json';
import mockDoiPublication from '../utils/testfiles/publication_generated_from_doi.json';
import mockPublications from '../utils/testfiles/publications_45_random_results_generated.json';
import mockNsdPublisers from '../utils/testfiles/publishersFromNsd.json';
import { PROJECT_SEARCH_URL } from './external/projectApi';

export const mockUser: FeideUser = {
  name: 'Test User',
  email: 'testuser@unit.no',
  'custom:identifiers': 'testuser@unit.no',
  'custom:orgName': 'unit',
  'custom:applicationRoles': `${RoleName.PUBLISHER},${RoleName.CURATOR}`,
  'custom:application': ApplicationName.NVA,
  'custom:orgNumber': 'NO293739283',
  'custom:commonName': 'Unit',
  'custom:feideId': 'tu@unit.no',
  sub: 'jasdfahkf-341-sdfdsf-12321',
  email_verfied: true,
  'custom:affiliation': '[member, employee, staff]',
  identities: "[{'userId':'91829182'}]",
};

const mockOrcidResponse: OrcidResponse = {
  id: 'https://sandbox.orcid.org/0000-0001-2345-6789',
  sub: '0000-0001-2345-6789',
  name: 'Sofia Garcia',
  family_name: 'Garcia',
  given_name: 'Sofia',
};

// AXIOS INTERCEPTOR
if (USE_MOCK_DATA) {
  const mock = new MockAdapter(Axios);

  console.log(`${PROJECT_SEARCH_URL}`);

  // SEARCH
  mock.onGet(new RegExp(`${API_URL}/${ApiServiceUrl.PUBLICATIONS}/*`)).reply(200, mockPublications);

  // Create publication from doi
  mock.onPost(new RegExp(`${API_URL}/${ApiServiceUrl.PUBLICATIONS}/doi/*`)).reply(200, mockDoiPublication);

  // lookup DOI
  mock.onGet(new RegExp(`${API_URL}/${ApiServiceUrl.DOI_LOOKUP}/*`)).reply(200, mockDoiLookupResponse);

  // PROJECT
  mock.onGet(new RegExp(`${PROJECT_SEARCH_URL}/*`)).reply(200, mockProjects, { 'X-Total-Count': '12' });

  // PUBLICATION CHANNEL
  mock.onPost(new RegExp(`${API_URL}/channel/search`)).reply(200, mockNsdPublisers);

  // USER
  mock.onGet(new RegExp(`${API_URL}/${ApiServiceUrl.USER}/*`)).reply(200, mockUser);

  // ORCID
  mock.onPost(ORCID_USER_INFO_URL).reply(200, mockOrcidResponse);

  // Authority Registry
  mock.onGet(new RegExp(`${AUTHORITY_REGISTER_API_URL}`)).reply(200, mockAuthoritiesResponse);

  mock.onAny().reply(function(config) {
    console.log('ERROR!');
    throw new Error('Could not find mock for ' + config.url);
  });
}
