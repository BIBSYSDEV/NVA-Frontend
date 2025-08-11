import { Hub } from 'aws-amplify/utils';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../redux/notificationSlice';

export const useAuthErrorListener = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    const unsubscribeAuthErrorListener = Hub.listen('auth', ({ payload }) => {
      if (payload.event === 'signInWithRedirect_failure') {
        dispatch(
          setNotification({
            message: t('feedback.error.login_failed'),
            variant: 'error',
          })
        );
      }
    });

    return unsubscribeAuthErrorListener;
  }, [dispatch, t]);
};
