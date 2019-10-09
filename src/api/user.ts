import { Auth } from 'aws-amplify';
import { Dispatch } from 'redux';

import {
  initLoginAction,
  initLogoutAction,
  refreshTokenAction,
  refreshTokenFailedAction,
  setUserAction,
} from '../actions/userActions';
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

export const refreshToken = () => {
  return async (dispatch: Dispatch) => {
    try {
      const currentSession = await Auth.currentSession();
      const cognitoUser = await Auth.currentAuthenticatedUser();
      console.log('idToken', currentSession.getIdToken().getExpiration());
      console.log('accessToken', currentSession.getAccessToken().getExpiration());
      if (!currentSession.isValid()) {
        cognitoUser.refreshSession(currentSession.getRefreshToken(), (error: any, session: any) => {
          if (error) {
            dispatch(refreshTokenFailedAction());
          }
          // const { idToken, refreshToken, accessToken } = session;
          // console.log('idtoken', idToken, 'refreshToken', refreshToken, 'accessToken', accessToken);
          dispatch(refreshTokenAction());
        });
      }
    } catch (e) {
      dispatch(refreshTokenFailedAction());
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
