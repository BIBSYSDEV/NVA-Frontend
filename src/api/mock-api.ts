import fetchMock from 'fetch-mock';
import { Dispatch } from 'redux';

import { orcidRequestFailureAction } from '../actions/errorActions';
import { searchForResources } from '../actions/resourceActions';
import { setOrcidInfo, setUserAction } from '../actions/userActions';
import { Resource } from '../types/resource.types';
import User from '../types/user.types';
import { SEARCH_RESULTS_PER_PAGE } from '../utils/constants';
import resources from '../utils/testfiles/resources_45_random_results_generated.json';
import user from '../utils/testfiles/user.json';

interface OrcidResponse {
  accessToken: string;
  tokenType: string;
  refreshToken: string;
  expiresIn: number;
  scope: string;
  name: string;
  orcid: string;
}

export const mockSetUser = async (dispatch: Dispatch) => {
  fetchMock.mock('http://example.com/user', user, { overwriteRoutes: false });
  return await fetch('http://example.com/user')
    .then(data => data.json())
    .then((data: User) => {
      dispatch(setUserAction(data));
    });
};

export const mockSearch = async (dispatch: Dispatch, searchTerm: string, offset: number) => {
  fetchMock.mock(`http://example.com/resources/${searchTerm}`, resources, { overwriteRoutes: false });
  return await fetch(`http://example.com/resources/${searchTerm}`)
    .then(data => data.json())
    .then((data: Resource[]) => {
      const result = data.slice(offset, offset + SEARCH_RESULTS_PER_PAGE);
      dispatch(searchForResources(result, searchTerm, data.length, offset));
    });
};

export const mockOrcidLookup = async (dispatch: Dispatch, orcidCode: string) => {
  const orcidResponse: OrcidResponse = {
    accessToken: 'f5af9f51-07e6-4332-8f1a-c0c11c1e3728',
    tokenType: 'bearer',
    refreshToken: 'f725f747-3a65-49f6-a231-3e8944ce464d',
    expiresIn: 631138518,
    scope: '/authorize',
    name: 'Sofia Garcia',
    orcid: '0000-0001-2345-6789',
  };

  fetchMock.mock('https://sandbox.orcid.org/oauth/token', orcidResponse, { overwriteRoutes: false });
  return await fetch('https://sandbox.orcid.org/oauth/token', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      client_id: '1234312313',
      client_secret: '1231jh1231j',
      grant_type: 'authorization_code',
      code: orcidCode,
      redirect_uri: 'http://localhost:3000',
    }),
  })
    .then(data => data.json())
    .then((data: OrcidResponse) => {
      dispatch(setOrcidInfo(data.name, data.orcid));
    })
    .catch(() => {
      dispatch(orcidRequestFailureAction('ORCID request failed'));
    });
};
