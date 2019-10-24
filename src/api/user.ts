import { Auth } from 'aws-amplify';
import { Dispatch } from 'redux';

import { refreshTokenFailureAction } from '../actions/errorActions';
import {
  initLoginAction,
  initLogoutAction,
  loginSuccessAction,
  refreshTokenSuccessAction,
  setUserAction,
} from '../actions/userActions';
import { emptyUser } from '../types/user.types';
import { useMockData } from '../utils/constants';
import { mockOrcidLookup, mockSetUser } from './mock-api';

export const login = () => {
  return async (dispatch: Dispatch) => {
    dispatch(initLoginAction());
    if (useMockData) {
      mockSetUser(dispatch);
      dispatch(loginSuccessAction());
    } else {
      Auth.federatedSignIn();
    }
  };
};

export const getCurrentAuthenticatedUser = () => {
  return async (dispatch: Dispatch<any>) => {
    if (useMockData) {
      mockSetUser(dispatch);
    } else {
      try {
        const cognitoUser = await Auth.currentAuthenticatedUser();
        const user = await cognitoUser.attributes;
        dispatch(setUserAction(user));
        dispatch(refreshToken());
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
      if (!currentSession.isValid()) {
        cognitoUser.refreshSession(currentSession.getRefreshToken(), (error: any) => {
          if (error) {
            dispatch(refreshTokenFailureAction(error));
          } else {
            dispatch(refreshTokenSuccessAction());
          }
        });
      }
    } catch (e) {
      dispatch(refreshTokenFailureAction(e));
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

export const getOrcidInfo = (orcidCode: string) => {
  return async (dispatch: Dispatch) => {
    if (useMockData) {
      mockOrcidLookup(dispatch, orcidCode);
    }
  };
};
