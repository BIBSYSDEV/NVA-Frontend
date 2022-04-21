import { Auth, CognitoUser } from '@aws-amplify/auth';
import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { USE_MOCK_DATA, LocalStorageKey } from '../utils/constants';
import { UrlPathTemplate } from '../utils/urlPaths';

export const getCurrentUserAttributes = async (retryNumber = 0): Promise<any> => {
  try {
    const currentSession: CognitoUserSession = await Auth.currentSession();
    const userInfo = (await Auth.currentUserInfo()).attributes;

    if (
      !currentSession.isValid() ||
      userInfo['custom:cristinId'] === undefined ||
      userInfo['custom:customerId'] === undefined
    ) {
      const cognitoUser: CognitoUser = await Auth.currentAuthenticatedUser();

      // Refresh session
      await new Promise((resolve) => {
        cognitoUser.refreshSession(currentSession.getRefreshToken(), (error, session) => {
          resolve(session);
        });
      });
      const refreshedUserInfo = (await Auth.currentUserInfo()).attributes;
      return refreshedUserInfo;
    } else {
      return userInfo;
    }
  } catch {
    // Don't do anything if user is not supposed to be logged in
    if (localStorage.getItem(LocalStorageKey.AmplifyRedirect)) {
      if (retryNumber < 3) {
        return await getCurrentUserAttributes(retryNumber + 1);
      } else {
        window.location.search = ''; // Avoid infinite error loop if code parameter gets stuck in URL
        return null;
      }
    }
  }
};

export const getAccessToken = async () => {
  if (USE_MOCK_DATA) {
    return '';
  }
  try {
    const cognitoUser = await Auth.currentAuthenticatedUser();
    return cognitoUser?.signInUserSession?.accessToken?.jwtToken ?? null;
  } catch (error) {
    if (error === 'The user is not authenticated') {
      // Expired session token. Set state in localStorage that App.tsx can act upon
      localStorage.setItem(LocalStorageKey.ExpiredToken, 'true');
      window.location.href = UrlPathTemplate.Home;
    }
    return null;
  }
};
