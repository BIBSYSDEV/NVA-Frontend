import { Hub } from 'aws-amplify/utils';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../redux/notificationSlice';

enum AuthErrorCode {
  Cancelled = 'User cancelled OAuth flow',
  MissingNin = 'IdentityService-1003',
}

export const useAuthErrorListener = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    const unsubscribeAuthErrorListener = Hub.listen('auth', ({ payload }) => {
      if (payload.event === 'signInWithRedirect_failure') {
        if (payload.data.error?.message.includes(AuthErrorCode.Cancelled)) {
          return;
        } else if (payload.data.error?.message.includes(AuthErrorCode.MissingNin)) {
          dispatch(setNotification({ message: t('feedback.error.login_failed_try_bankid'), variant: 'error' }));
        } else {
          dispatch(setNotification({ message: t('feedback.error.login_failed'), variant: 'error' }));
        }
      }
    });

    return unsubscribeAuthErrorListener;
  }, [dispatch, t]);
};
