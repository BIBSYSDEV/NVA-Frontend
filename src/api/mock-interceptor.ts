import Axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import OrcidResponse from '../types/orcid.types';
import User, { ApplicationName, RoleName } from '../types/user.types';
import { ORCID_API_BASEURL, RESOURCES_API_BASEURL, useMockData, USER_API_BASEURL } from '../utils/constants';
import mockResources from '../utils/testfiles/resources_45_random_results_generated.json';

export const mockUser: User = {
  name: 'Test User',
  email: 'testuser@unit.no',
  id: 'testuser@unit.no',
  institution: 'unit',
  roles: [RoleName.PUBLISHER, RoleName.CURATOR],
  applications: [ApplicationName.NVA, ApplicationName.BIRD],
  orcidName: '',
  orcid: '', //0000-0001-2345-6789
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
if (useMockData) {
  const mock = new MockAdapter(Axios);

  // //SEARCH
  mock.onGet(new RegExp(`${RESOURCES_API_BASEURL}/*`)).reply(200, mockResources);

  //USER
  mock.onGet(new RegExp(`${USER_API_BASEURL}/*`)).reply(200, mockUser);

  //ORCID
  mock.onPost(ORCID_API_BASEURL).reply(200, mockOrcidResponse);

  mock.onAny().reply(function(config) {
    throw new Error('Could not find mock for ' + config.url);
  });
}
