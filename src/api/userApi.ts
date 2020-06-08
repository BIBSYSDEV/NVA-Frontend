import { Auth } from 'aws-amplify';
import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { Dispatch } from 'redux';

import { logoutSuccess } from '../redux/actions/authActions';
import { clearUser, setUser } from '../redux/actions/userActions';
import i18n from '../translations/i18n';
import { USE_MOCK_DATA } from '../utils/constants';
import { mockUser } from '../utils/testfiles/mock_feide_user';
import { setNotification } from '../redux/actions/notificationActions';
import { NotificationVariant } from '../types/notification.types';
import { FeideUser } from '../types/user.types';

export const login = () => {
  return async (dispatch: Dispatch) => {
    if (USE_MOCK_DATA) {
      dispatch(setUser(mockUser));
    } else {
      Auth.federatedSignIn();
    }
  };
};

export const getCurrentUserAttributes = async (): Promise<FeideUser | any> => {
  let userAttributes = undefined;
  try {
    const cognitoUser = await Auth.currentAuthenticatedUser();
    cognitoUser?.getSession(async (error: any, session: CognitoUserSession) => {
      if (error || !session.isValid()) {
        const currentSession = await Auth.currentSession();
        cognitoUser.refreshSession(currentSession.getRefreshToken());
      } else {
        userAttributes = cognitoUser.attributes;
      }
    });
  } catch {
    return { error: i18n.t('feedback:error.get_user') };
  }
  return userAttributes;
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
            dispatch(setNotification(error, NotificationVariant.Error));
          }
        });
      }
    } catch (e) {
      dispatch(setNotification(e, NotificationVariant.Error));
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
