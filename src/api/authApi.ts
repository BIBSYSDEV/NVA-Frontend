import { fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth';
import { LocalStorageKey, USE_MOCK_DATA } from '../utils/constants';
import { UrlPathTemplate } from '../utils/urlPaths';

export const getUserAttributes = async (retryNumber = 0): Promise<any> => {
  try {
    const userAttributes = await fetchUserAttributes();
    return userAttributes;
  } catch (error) {
    if (localStorage.getItem(LocalStorageKey.AmplifyRedirect) && retryNumber < 3) {
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
    return currentSession.tokens?.accessToken.toString() ?? null;
  } catch (error) {
    if (error === 'The user is not authenticated') {
      window.location.href = UrlPathTemplate.Home;
    }
    return null;
  }
};
