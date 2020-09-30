import { Auth } from 'aws-amplify';
import { CognitoUser } from '@aws-amplify/auth';
import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { Dispatch } from 'redux';
import i18n from '../translations/i18n';
import { USE_MOCK_DATA, AMPLIFY_REDIRECTED_KEY } from '../utils/constants';
import { setNotification } from '../redux/actions/notificationActions';
import { NotificationVariant } from '../types/notification.types';

export const getCurrentUserAttributes = async (): Promise<any> => {
  try {
    const currentSession: CognitoUserSession = await Auth.currentSession();
    const currentSessionData = currentSession.getIdToken().payload;
    console.log('currentSessionData', currentSessionData);
    if (
      !currentSession.isValid() ||
      !currentSessionData['custom:cristinId'] ||
      !currentSessionData['custom:customerId']
    ) {
      console.log('invalid session');
      const cognitoUser: CognitoUser = await Auth.currentAuthenticatedUser();

      // Refresh session
      const refreshedSession: CognitoUserSession = await new Promise((resolve) => {
        cognitoUser.refreshSession(currentSession.getRefreshToken(), (error, session) => {
          resolve(session);
        });
      });
      const refreshedSessionData = refreshedSession.getIdToken().payload;

      console.log('refreshedSession', refreshedSessionData);
      return refreshedSessionData;
    } else {
      console.log('valid session', currentSession.getIdToken().payload);
      return currentSessionData;
    }
  } catch {
    console.log('CATCH');
    const loggedIn = localStorage.getItem(AMPLIFY_REDIRECTED_KEY);
    if (loggedIn) {
      return { error: i18n.t('feedback:error.get_user') };
    }
  }
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
