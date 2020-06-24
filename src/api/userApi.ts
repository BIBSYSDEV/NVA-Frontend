import { Auth } from 'aws-amplify';
import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { Dispatch } from 'redux';
import i18n from '../translations/i18n';
import { USE_MOCK_DATA } from '../utils/constants';
import { setNotification } from '../redux/actions/notificationActions';
import { NotificationVariant } from '../types/notification.types';
import { setUser } from '../redux/actions/userActions';

export const getCurrentUserAttributes = () => {
  return async (dispatch: Dispatch) => {
    try {
      const cognitoUser = await Auth.currentAuthenticatedUser();
      cognitoUser?.getSession(async (error: any, session: CognitoUserSession) => {
        if (error || !session.isValid()) {
          const currentSession = await Auth.currentSession();
          cognitoUser.refreshSession(currentSession.getRefreshToken());
        } else {
          const loggedInUser = (await Auth.currentSession()).getIdToken().payload;
          dispatch(setUser(loggedInUser));
        }
      });
    } catch {
      dispatch(setNotification(i18n.t('feedback:error.get_user', NotificationVariant.Error)));
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
            dispatch(setNotification(error, NotificationVariant.Error));
          }
        });
      }
    } catch (e) {
      dispatch(setNotification(e, NotificationVariant.Error));
    }
  };
};
