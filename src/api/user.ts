import { Auth } from 'aws-amplify';
import { Dispatch } from 'redux';

import {
  initLogin,
  initLogout,
  loginSuccess,
  logoutSuccess,
  refreshTokenFailure,
  refreshTokenSuccess,
} from '../redux/actions/authActions';
import { clearFeedback } from '../redux/actions/feedbackActions';
import { clearUser, setUser, setUserFailure } from '../redux/actions/userActions';
import { USE_MOCK_DATA } from '../utils/constants';
import { mockUser } from './mock-interceptor';

export const login = () => {
  return async (dispatch: Dispatch) => {
    dispatch(initLogin());
    if (USE_MOCK_DATA) {
      dispatch(setUser(mockUser));
      dispatch(loginSuccess());
    } else {
      Auth.federatedSignIn();
    }
  };
};

export const getCurrentAuthenticatedUser = () => {
  return async (dispatch: Dispatch<any>) => {
    if (USE_MOCK_DATA) {
      dispatch(setUser(mockUser));
    } else {
      try {
        const cognitoUser = await Auth.currentAuthenticatedUser();
        const user = await cognitoUser.attributes;
        dispatch(setUser(user));
        dispatch(refreshToken());
      } catch (e) {
        dispatch(setUserFailure('ErrorMessage.Failed to get user'));
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
            dispatch(refreshTokenFailure(error));
          } else {
            dispatch(refreshTokenSuccess());
          }
        });
      }
    } catch (e) {
      dispatch(refreshTokenFailure(e));
    }
  };
};

export const logout = () => {
  return async (dispatch: Dispatch) => {
    dispatch(initLogout());
    if (USE_MOCK_DATA) {
      dispatch(clearUser());
      dispatch(clearFeedback());
      dispatch(logoutSuccess());
    } else {
      Auth.signOut();
      dispatch(clearFeedback());
    }
  };
};
