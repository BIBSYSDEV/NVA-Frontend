import fetchMock from 'fetch-mock';
import { Dispatch } from 'redux';

import { fetchResources } from '../actions/resourceActions';
import { setUserAction } from '../actions/userActions';
import { Resource } from '../types/resource.types';
import User from '../types/user.types';
import resources from '../utils/testfiles/resources.json';
import user from '../utils/testfiles/user.json';

export const mockSetUser = async (dispatch: Dispatch) => {
  fetchMock.mock('http://example.com/user', user);
  return await fetch('http://example.com/user')
    .then(data => data.json())
    .then((data: User) => {
      dispatch(setUserAction(data));
    })
    .then(() => {
      fetchMock.reset();
    });
};

export const mockGetResources = async (dispatch: Dispatch) => {
  fetchMock.mock('http://example.com/resources', resources);
  return await fetch('http://example.com/resources')
    .then(data => data.json())
    .then((data: Resource[]) => {
      dispatch(fetchResources(data));
    })
    .then(() => {
      fetchMock.reset();
    });
};
