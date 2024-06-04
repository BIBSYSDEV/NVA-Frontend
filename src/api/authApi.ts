import { fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth';
import { FeideUser } from '../types/user.types';
import { LocalStorageKey, USE_MOCK_DATA } from '../utils/constants';
import { getCurrentPath } from '../utils/general-helpers';
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
    if (currentSession.tokens) {
      return currentSession.tokens.accessToken.toString();
    } else {
      const searchParams = new URLSearchParams();
      searchParams.set(LocalStorageKey.RedirectPath, getCurrentPath());
      window.location.href = `${UrlPathTemplate.SignedOut}?${searchParams.toString()}`;
      return null;
    }
  } catch {
    return null;
  }
};

export const userIsAuthenticated = async () => {
  try {
    const cognitoUser = await fetchAuthSession();
    return !!cognitoUser.tokens;
  } catch {
    return false;
  }
};
