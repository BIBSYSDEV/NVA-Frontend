import { Auth } from 'aws-amplify';
import { Dispatch } from 'redux';

import {
  initLoginAction,
  initLogoutAction,
  loginSuccessAction,
  logoutSuccessAction,
  refreshTokenFailureAction,
  refreshTokenSuccessAction,
} from '../redux/actions/authActions';
import { clearFeedbackAction } from '../redux/actions/feedbackActions';
import { clearUserAction, setUserAction, setUserFailureAction } from '../redux/actions/userActions';
import { useMockData } from '../utils/constants';
import { mockUser } from './mock-interceptor';

export const login = () => {
  return async (dispatch: Dispatch) => {
    dispatch(initLoginAction());
    if (useMockData) {
      dispatch(setUserAction(mockUser));
      dispatch(loginSuccessAction());
    } else {
      Auth.federatedSignIn();
    }
  };
};

export const getCurrentAuthenticatedUser = () => {
  return async (dispatch: Dispatch<any>) => {
    if (useMockData) {
      dispatch(setUserAction(mockUser));
    } else {
      try {
        const cognitoUser = await Auth.currentAuthenticatedUser();
        const user = await cognitoUser.attributes;
        dispatch(setUserAction(user));
        dispatch(refreshToken());
      } catch (e) {
        dispatch(setUserFailureAction('ErrorMessage.Failed to get user'));
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
      dispatch(clearUserAction());
      dispatch(clearFeedbackAction());
      dispatch(logoutSuccessAction());
    } else {
      Auth.signOut();
      dispatch(clearFeedbackAction());
    }
  };
};
