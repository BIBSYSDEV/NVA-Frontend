import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { removeNotification } from '../redux/actions/notificationActions';
import { RootStore } from '../redux/reducers/rootReducer';

export const Notifier: React.FC = () => {
  const notifications = useSelector((store: RootStore) => store.notifications);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  useEffect(() => {
    notifications.map(notification => {
      if (notification.dismissed) {
        closeSnackbar(notification.key);
        dispatch(removeNotification(notification.key));
      }
      return null;
    });
  }, [notifications, closeSnackbar, dispatch]);

  useEffect(() => {
    notifications.map(notification => {
      if (!notification.dismissed) {
        const options = {
          key: notification.key,
          variant: notification.variant,
          onClick: () => {
            closeSnackbar(notification.key);
          },
        };
        setTimeout(() => {
          if (notification.variant === 'error') {
            enqueueSnackbar(notification.message, {
              ...options,
              persist: true,
            });
          } else {
            enqueueSnackbar(notification.message, { ...options });
            dispatch(removeNotification(notification.key));
          }
        }, 300);
      }
      return null;
    });
  }, [notifications, closeSnackbar, dispatch, enqueueSnackbar]);

  return null;
};

export default Notifier;
