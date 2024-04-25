import { fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth';
import { FeideUser } from '../types/user.types';
import { USE_MOCK_DATA } from '../utils/constants';
import { UrlPathTemplate } from '../utils/urlPaths';

export const getUserAttributes = async (retryNumber = 0): Promise<FeideUser | null> => {
  try {
    const userAttributes = (await fetchUserAttributes()) as FeideUser;
    return userAttributes;
  } catch (error) {
    if (retryNumber < 3) {
      // Retry when user has signed in, as the user attributes are not always available immediately for some reason
      await new Promise((resolve) => setTimeout(resolve, 1000 * (retryNumber + 1)));
      return await getUserAttributes(retryNumber + 1);
    }
    return null;
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
      window.location.href = UrlPathTemplate.Home;
    }
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
