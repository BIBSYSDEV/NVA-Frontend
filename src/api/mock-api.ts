import fetchMock from 'fetch-mock';
import { Dispatch } from 'redux';

import { setUserAction } from '../actions/userActions';
import User from '../types/user.types';
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
