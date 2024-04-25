import { fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth';
import { FeideUser } from '../types/user.types';
import { USE_MOCK_DATA } from '../utils/constants';
import { UrlPathTemplate } from '../utils/urlPaths';

export const getUserAttributes = async (): Promise<FeideUser | null> => {
  try {
    const userAttributes = (await fetchUserAttributes()) as FeideUser;
    return userAttributes;
  } catch {
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
