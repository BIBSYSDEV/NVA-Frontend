import { Auth } from 'aws-amplify';
import { CognitoUser } from '@aws-amplify/auth';
import { CognitoUserSession } from 'amazon-cognito-identity-js';
import i18n from '../translations/i18n';
import { USE_MOCK_DATA, AMPLIFY_REDIRECTED_KEY } from '../utils/constants';

export const getCurrentUserAttributes = async (retryNumber = 0): Promise<any> => {
  try {
    const currentSession: CognitoUserSession = await Auth.currentSession();
    const currentSessionData = currentSession.getIdToken().payload;

    if (
      !currentSession.isValid() ||
      currentSessionData['custom:cristinId'] === undefined ||
      currentSessionData['custom:customerId'] === undefined
    ) {
      const cognitoUser: CognitoUser = await Auth.currentAuthenticatedUser();

      // Refresh session
      const refreshedSession: CognitoUserSession = await new Promise((resolve) => {
        cognitoUser.refreshSession(currentSession.getRefreshToken(), (error, session) => {
          resolve(session);
        });
      });
      const refreshedSessionData = refreshedSession.getIdToken().payload;
      return refreshedSessionData;
    } else {
      return currentSessionData;
    }
  } catch {
    // Don't do anything if user is not supposed to be logged in
    if (localStorage.getItem(AMPLIFY_REDIRECTED_KEY)) {
      if (retryNumber < 3) {
        return await getCurrentUserAttributes(retryNumber + 1);
      } else {
        window.location.search = ''; // Avoid infinite error loop if code parameter gets stuck in URL
        return { error: i18n.t('feedback:error.get_user') };
      }
    }
  }
};

export const getIdToken = async () => {
  if (USE_MOCK_DATA) {
    return '';
  }
  const cognitoUser = await Auth.currentAuthenticatedUser();
  return cognitoUser?.signInUserSession?.idToken?.jwtToken || null;
};
