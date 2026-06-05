import { AuthSession, fetchAuthSession, FetchAuthSessionOptions } from 'aws-amplify/auth';
import { CustomUserAttributes } from '../types/user.types';
import { LocalStorageKey, USE_MOCK_DATA } from '../utils/constants';
import { getCurrentPath } from '../utils/general-helpers';
import { isPublicPage, UrlPathTemplate } from '../utils/urlPaths';

export const getAccessToken = async () => {
  if (USE_MOCK_DATA) {
    return '';
  }
  try {
    const currentSession = await fetchAuthSession();
    if (currentSession.tokens) {
      return currentSession.tokens.accessToken.toString();
    } else {
      const currentPath = getCurrentPath();
      // Don't redirect to SignedOut when viewing public content (e.g. a registration landing page);
      // the request simply proceeds unauthenticated instead of kicking the user off a public page.
      if (!isPublicPage(currentPath)) {
        const searchParams = new URLSearchParams();
        searchParams.set(LocalStorageKey.RedirectPath, currentPath);
        window.location.href = `${UrlPathTemplate.SignedOut}?${searchParams.toString()}`;
      }
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

export const getCustomUserAttributes = async (options?: FetchAuthSessionOptions) => {
  try {
    const currentSession = await fetchAuthSession(options);
    return getCustomTokenAttributes(currentSession.tokens);
  } catch {
    return null;
  }
};

const getCustomTokenAttributes = (tokens?: AuthSession['tokens']) => {
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
