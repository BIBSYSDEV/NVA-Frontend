import { AuthSession, fetchAuthSession } from 'aws-amplify/auth';
import { CustomUserAttributes } from '../types/user.types';
import { LocalStorageKey, USE_MOCK_DATA } from '../utils/constants';
import { getCurrentPath } from '../utils/general-helpers';
import { UrlPathTemplate } from '../utils/urlPaths';

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
  try {
    const currentSession = await fetchAuthSession();
    const customTokenAttributes = getCustomTokenAttributes(currentSession.tokens);
    return customTokenAttributes;
  } catch {
    return null;
  }
};

export const getCustomTokenAttributes = (tokens?: AuthSession['tokens']) => {
  const idTokenPayload = tokens?.idToken?.payload;
  const accessTokenPayload = tokens?.accessToken?.payload;

  if (!idTokenPayload || !accessTokenPayload) {
    return null;
  }

  const customAttributesObject = Object.entries({ ...idTokenPayload, ...accessTokenPayload })
    .filter(([key]) => key.startsWith('custom:'))
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}) as CustomUserAttributes;

  return customAttributesObject;
};
