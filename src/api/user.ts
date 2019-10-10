import { Auth } from 'aws-amplify';
import { Dispatch } from 'redux';

import { initLoginAction, initLogoutAction, setUserAction } from '../actions/userActions';
import { emptyUser } from '../types/user.types';
import { useMockData } from '../utils/constants';
import { mockSetUser } from './mock-api';

export const login = () => {
  return async (dispatch: Dispatch) => {
    dispatch(initLoginAction());
    if (useMockData) {
      mockSetUser(dispatch);
    } else {
      Auth.federatedSignIn();
    }
  };
};

export const getCurrentAuthenticatedUser = () => {
  return async (dispatch: Dispatch) => {
    if (useMockData) {
      mockSetUser(dispatch);
    } else {
      try {
        const cognitoUser = await Auth.currentAuthenticatedUser();
        const { name, email } = await cognitoUser.attributes;
        dispatch(setUserAction({ name, email }));
      } catch (e) {
        dispatch(setUserAction(emptyUser));
      }
    }
  };
};

export const logout = () => {
  return async (dispatch: Dispatch) => {
    dispatch(initLogoutAction());
    if (useMockData) {
      dispatch(setUserAction(emptyUser));
    } else {
      Auth.signOut();
    }
  };
};
