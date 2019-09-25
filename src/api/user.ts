import { Dispatch } from 'redux';
import fetchMock from 'fetch-mock';

import user from '../testfiles/user.json';
import User from '../types/user.types';
import { setUser } from '../actions/userActions';
import { useMockData } from '../utils/constants';

export const getLoggedInUser = () => {
  return async (dispatch: Dispatch) => {
    // if mock data is turned on then use fetch-mock
    // create .env file containing 'REACT_APP_USE_MOCK=true' to use mock data
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
