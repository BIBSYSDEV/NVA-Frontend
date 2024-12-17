import { fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth';
import { UserAttributes } from '../types/user.types';
import { LocalStorageKey, USE_MOCK_DATA } from '../utils/constants';
import { getCurrentPath } from '../utils/general-helpers';
import { UrlPathTemplate } from '../utils/urlPaths';

export const refreshSession = async () => {
  try {
    return await fetchAuthSession({ forceRefresh: true });
  } catch {
    return null;
  }
};

export const getUserAttributes = async (): Promise<UserAttributes | null> => {
  try {
    const userAttributes = (await fetchUserAttributes()) as UserAttributes;
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
    if (currentSession.tokens?.accessToken) {
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

export const getIdTokenPayload = async () => {
  if (USE_MOCK_DATA) {
    return '';
  }
  try {
    const currentSession = await fetchAuthSession();
    if (currentSession.tokens?.idToken) {
      return currentSession.tokens.idToken.payload as UserAttributes;
    } else {
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
