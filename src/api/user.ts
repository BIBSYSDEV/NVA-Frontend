import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { Auth } from 'aws-amplify';
import { Dispatch } from 'redux';

import {
  initLogin,
  initLogout,
  loginSuccess,
  logoutSuccess,
  refreshTokenFailure,
  refreshTokenSuccess,
  sessionInvalidFailure,
} from '../redux/actions/authActions';
import { clearUser, setUser, setUserFailure } from '../redux/actions/userActions';
import { RootStore } from '../redux/reducers/rootReducer';
import i18n from '../translations/i18n';
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
  return async (dispatch: Dispatch<any>, getState: () => RootStore) => {
    try {
      const cognitoUser = await Auth.currentAuthenticatedUser();
      if (cognitoUser != null) {
        cognitoUser.getSession((error: any, session: CognitoUserSession) => {
          if (error || !session.isValid()) {
            dispatch(sessionInvalidFailure(i18n.t('feedback:error.get_session')));
          }

          // NOTE: getSession must be called to authenticate user before calling getUserAttributes
          cognitoUser.getUserAttributes((error: any) => {
            if (error) {
              dispatch(setUserFailure(i18n.t('feedback:error.get_user')));
            } else {
              dispatch(setUser(cognitoUser.attributes));
            }
          });
        });
      }
      dispatch(refreshToken());
    } catch (e) {
      const store = getState();
      if (store.auth.isLoggedIn) {
        dispatch(setUserFailure(i18n.t('feedback:error.get_user')));
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
      dispatch(logoutSuccess());
    } else {
      Auth.signOut();
    }
  };
};
