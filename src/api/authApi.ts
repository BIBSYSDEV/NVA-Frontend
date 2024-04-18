import { fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth';
import { FeideUser } from '../types/user.types';
import { LocalStorageKey, USE_MOCK_DATA } from '../utils/constants';
import { UrlPathTemplate } from '../utils/urlPaths';

export const getUserAttributes = async (retryNumber = 0): Promise<FeideUser | null> => {
  try {
    const userAttributes = (await fetchUserAttributes()) as FeideUser;
    return userAttributes;
  } catch (error) {
    if (localStorage.getItem(LocalStorageKey.AmplifyRedirect) && retryNumber < 3) {
      // Retry when user has signed in, as the user attributes are not always available immediately for some reason
      await new Promise((resolve) => setTimeout(resolve, 1000 * (retryNumber + 1)));
      return await getUserAttributes(retryNumber + 1);
    }
    return null;
  } finally {
    localStorage.removeItem(LocalStorageKey.AmplifyRedirect);
  }
};

export const getAccessToken = async () => {
  if (USE_MOCK_DATA) {
    return '';
  }
  try {
    const currentSession = await fetchAuthSession();

    if (currentSession.tokens) {
      return currentSession.tokens.accessToken.toString();
    } else {
      // Expired session token. Set state in localStorage that App.tsx can act upon
      localStorage.setItem(LocalStorageKey.ExpiredToken, 'true');
      window.location.href = UrlPathTemplate.Home;
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const userIsAuthenticated = async () => {
  try {
    const cognitoUser = await fetchAuthSession();
    if (cognitoUser) {
      return true;
    } else {
      return false;
    }
  } catch {
    return false;
  }
};
