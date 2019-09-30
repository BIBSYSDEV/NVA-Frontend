import fetchMock from 'fetch-mock';
import { Dispatch } from 'redux';

import { setUser } from '../actions/userActions';
import User from '../types/user.types';
import { useMockData } from '../utils/constants';
import user from '../utils/testfiles/user.json';

export const getLoggedInUser = () => {
  return async (dispatch: Dispatch) => {
    if (useMockData) {
      fetchMock.mock('http://example.com/user', user);
      return await fetch('http://example.com/user')
        .then(data => data.json())
        .then((data: User) => {
          dispatch(setUser(data));
        });
    }
  };
};
