import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { Auth } from 'aws-amplify';
import { Dispatch } from 'redux';

import { loginSuccess, logoutSuccess } from '../redux/actions/authActions';
import { clearUser, setUser } from '../redux/actions/userActions';
import { RootStore } from '../redux/reducers/rootReducer';
import i18n from '../translations/i18n';
import { USE_MOCK_DATA } from '../utils/constants';
import { mockUser } from '../utils/testfiles/mock_feide_user';
import { addNotification } from '../redux/actions/notificationActions';
import { NotificationVariant } from '../types/notification.types';

export const login = () => {
  return async (dispatch: Dispatch) => {
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
      cognitoUser?.getSession(async (error: any, session: CognitoUserSession) => {
        if (error || !session.isValid()) {
          const currentSession = await Auth.currentSession();
          cognitoUser.refreshSession(currentSession.getRefreshToken());
        } else {
          // NOTE: getSession must be called to authenticate user before calling getUserAttributes
          cognitoUser.getUserAttributes((error: any) => {
            if (error) {
              dispatch(addNotification(i18n.t('feedback:error.get_user', NotificationVariant.Error)));
            } else {
              dispatch(setUser(cognitoUser.attributes));
            }
          });
        }
      });
    } catch {
      const store = getState();
      if (store.user.isLoggedIn) {
        dispatch(addNotification(i18n.t('feedback:error.get_user', NotificationVariant.Error)));
      }
    }
  };
};

export const getIdToken = async () => {
  if (USE_MOCK_DATA) {
    return '';
  }
  const cognitoUser = await Auth.currentAuthenticatedUser();
  return cognitoUser?.signInUserSession?.idToken?.jwtToken || null;
};

export const refreshToken = () => {
  return async (dispatch: Dispatch) => {
    try {
      const currentSession = await Auth.currentSession();
      const cognitoUser = await Auth.currentAuthenticatedUser();
      if (!currentSession.isValid()) {
        cognitoUser.refreshSession(currentSession.getRefreshToken(), (error: any) => {
          if (error) {
            dispatch(addNotification(error, NotificationVariant.Error));
          }
        });
      }
    } catch (e) {
      dispatch(addNotification(e, NotificationVariant.Error));
    }
  };
};

export const logout = () => {
  return async (dispatch: Dispatch) => {
    if (USE_MOCK_DATA) {
      dispatch(clearUser());
      dispatch(logoutSuccess());
    } else {
      Auth.signOut();
    }
  };
};
