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
    notifications.forEach(notification => {
      const options = {
        key: notification.key,
        variant: notification.variant,
        onClick: () => {
          closeSnackbar(notification.key);
        },
        preventDuplicate: true,
      };
      if (notification.dismissed) {
        closeSnackbar(notification.key);
        dispatch(removeNotification(notification.key));
      } else {
        if (notification.variant === 'error') {
          enqueueSnackbar(notification.message, {
            ...options,
            persist: true,
          });
        } else {
          enqueueSnackbar(notification.message, { ...options });
          dispatch(removeNotification(notification.key));
        }
      }
    });
  }, [notifications, closeSnackbar, dispatch, enqueueSnackbar]);

  return null;
};

export default Notifier;
