import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import { Hub } from 'aws-amplify/utils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { redirectToSignedOut } from '../../api/authApi';
import { setNotification } from '../../redux/notificationSlice';
import { logoutSuccess } from '../../redux/userSlice';
import { getLoginErrorMessageKey, refreshErrorEndsSession } from '../auth-error-helpers';

const cancelledLoginMessage = 'User cancelled OAuth flow';

/**
 * Shows login errors, and ends the session when a token refresh fails in a way only a new login
 * can fix.
 *
 * Returns true once a login redirect has failed. Amplify may leave a fetchAuthSession started
 * during the redirect waiting for up to 5 minutes, while a new call returns at once, so callers
 * should fetch the session again.
 */
export const useAuthErrorListener = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [loginFailed, setLoginFailed] = useState(false);

  useEffect(() => {
    const endSession = async () => {
      // Amplify keeps the tokens on this error, so the next page load would find the user logged in
      await cognitoUserPoolsTokenProvider.authTokenStore.clearTokens();
      dispatch(logoutSuccess());
      redirectToSignedOut();
    };

    return Hub.listen('auth', ({ payload }) => {
      if (payload.event === 'signInWithRedirect_failure') {
        setLoginFailed(true);
        const errorMessage = payload.data.error?.message;
        if (!errorMessage?.includes(cancelledLoginMessage)) {
          dispatch(
            setNotification({
              message: t(getLoginErrorMessageKey(errorMessage)),
              variant: 'error',
            })
          );
        }
      } else if (payload.event === 'tokenRefresh_failure' && refreshErrorEndsSession(payload.data.error?.message)) {
        endSession();
      }
    });
  }, [dispatch, t]);

  return loginFailed;
};
