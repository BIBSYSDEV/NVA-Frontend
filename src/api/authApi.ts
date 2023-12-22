// import { fetchUserAttributes, getCurrentUser } from 'aws-amplify';
// import { fetchAuthSession } from 'aws-amplify/auth';
import { fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth';
import { LocalStorageKey, USE_MOCK_DATA } from '../utils/constants';
import { UrlPathTemplate } from '../utils/urlPaths';

export const getCurrentUserAttributes = async (retryNumber = 0): Promise<any> => {
  try {
    // const currentSession = await fetchAuthSession();
    // const currentUser = await getCurrentUser();
    const userAttributes = await fetchUserAttributes();

    return userAttributes;
    // TODO: refresh session?

    // if (!currentSession.isValid()) {
    //   const cognitoUser: CognitoUser = await Auth.currentAuthenticatedUser();
    //   // Refresh session
    //   await new Promise((resolve) => {
    //     cognitoUser.refreshSession(currentSession.getRefreshToken(), (error, session) => {
    //       resolve(session);
    //     });
    //   });
    // }

    // const userInfo = await Auth.currentUserInfo();
    // return userInfo.attributes;
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
    const currentSession = await fetchAuthSession();
    return currentSession.tokens?.accessToken.toString() ?? null;
  } catch (error) {
    if (error === 'The user is not authenticated') {
      // Expired session token. Set state in localStorage that App.tsx can act upon
      localStorage.setItem(LocalStorageKey.ExpiredToken, 'true');
      window.location.href = UrlPathTemplate.Home;
    }
    return null;
  }
};
