import { Auth } from 'aws-amplify';
import { CognitoUser } from '@aws-amplify/auth';
import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { USE_MOCK_DATA, AMPLIFY_REDIRECTED_KEY } from '../utils/constants';
import { UrlPathTemplate } from '../utils/urlPaths';

export const getCurrentUserAttributes = async (retryNumber = 0): Promise<any> => {
  try {
    const currentSession: CognitoUserSession = await Auth.currentSession();
    const currentSessionData = currentSession.getIdToken().payload;

    if (
      !currentSession.isValid() ||
      currentSessionData['custom:cristinId'] === undefined ||
      currentSessionData['custom:customerId'] === undefined
    ) {
      const cognitoUser: CognitoUser = await Auth.currentAuthenticatedUser();

      // Refresh session
      const refreshedSession: CognitoUserSession = await new Promise((resolve) => {
        cognitoUser.refreshSession(currentSession.getRefreshToken(), (error, session) => {
          resolve(session);
        });
      });
      const refreshedSessionData = refreshedSession.getIdToken().payload;
      return refreshedSessionData;
    } else {
      return currentSessionData;
    }
  } catch {
    // Don't do anything if user is not supposed to be logged in
    if (localStorage.getItem(AMPLIFY_REDIRECTED_KEY)) {
      if (retryNumber < 3) {
        return await getCurrentUserAttributes(retryNumber + 1);
      } else {
        window.location.search = ''; // Avoid infinite error loop if code parameter gets stuck in URL
        return null;
      }
    }
  }
};

export const expiredTokenKey = 'expiredToken';

export const getIdToken = async () => {
  console.log('getIdToken');
  if (USE_MOCK_DATA) {
    return '';
  }
  try {
    const cognitoUser = await Auth.currentAuthenticatedUser();
    return cognitoUser?.signInUserSession?.idToken?.jwtToken ?? null;
  } catch (error) {
    if (error === 'The user is not authenticated') {
      // Expires session token
      console.log('getIdToken Error', error);
      localStorage.setItem(expiredTokenKey, 'true');
      window.location.href = UrlPathTemplate.Home;
    }
    return null;
  }
};
