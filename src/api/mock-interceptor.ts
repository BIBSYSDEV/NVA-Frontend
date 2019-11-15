import Axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import OrcidResponse from '../types/orcid.types';
import { ApplicationName, FeideUser, RoleName } from '../types/user.types';
import { ApiBaseUrl, ORCID_OAUTH_URL, USE_MOCK_DATA } from '../utils/constants';
import mockResources from '../utils/testfiles/resources_45_random_results_generated.json';

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
  accessToken: 'f5af9f51-07e6-4332-8f1a-c0c11c1e3728',
  tokenType: 'bearer',
  refreshToken: 'f725f747-3a65-49f6-a231-3e8944ce464d',
  expiresIn: 631138518,
  scope: '/authorize',
  name: 'Sofia Garcia',
  orcid: '0000-0001-2345-6789',
};

// AXIOS INTERCEPTOR
if (USE_MOCK_DATA) {
  const mock = new MockAdapter(Axios);

  // SEARCH
  mock.onGet(new RegExp(`/${ApiBaseUrl.RESOURCES}/*`)).reply(200, mockResources);

  // USER
  mock.onGet(new RegExp(`/${ApiBaseUrl}/*`)).reply(200, mockUser);

  // ORCID
  mock.onPost(ORCID_OAUTH_URL).reply(200, mockOrcidResponse);

  mock.onAny().reply(function(config) {
    throw new Error('Could not find mock for ' + config.url);
  });
}
