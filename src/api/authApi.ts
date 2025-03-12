import { fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth';
import { CustomUserAttributes } from '../types/user.types';
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

export const getUserAttributes = async (): Promise<CustomUserAttributes | null> => {
  try {
    const userAttributes = (await fetchUserAttributes()) as CustomUserAttributes;
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

export const getCustomUserAttributes = async () => {
  // if (USE_MOCK_DATA) {
  //   return '';
  // }
  try {
    const currentSession = await fetchAuthSession();
    const idTokenPayload = currentSession.tokens?.idToken?.payload;
    const accessTokenPayload = currentSession.tokens?.accessToken?.payload;

    if (idTokenPayload && accessTokenPayload) {
      const customUserAttributes = Object.entries({ ...idTokenPayload, ...accessTokenPayload })
        .filter(([key]) => key.startsWith('custom:'))
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
      return customUserAttributes as CustomUserAttributes;
    } else {
      return null;
    }
  } catch {
    return null;
  }
};
