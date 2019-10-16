import fetchMock from 'fetch-mock';
import { Dispatch } from 'redux';

import { searchForResources } from '../actions/resourceActions';
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

export const mockSearch = async (dispatch: Dispatch, searchTerm: string) => {
  fetchMock.mock(`http://example.com/resources/${searchTerm}`, resources);
  return await fetch(`http://example.com/resources/${searchTerm}`)
    .then(data => data.json())
    .then((data: Resource[]) => {
      dispatch(searchForResources(data, searchTerm));
    })
    .then(() => {
      fetchMock.reset();
    });
};
