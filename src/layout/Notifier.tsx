import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { removeNotification } from '../redux/actions/feedbackActions';
import { RootStore } from '../redux/reducers/rootReducer';

export const Notifier: React.FC = () => {
  const notifications = useSelector((store: RootStore) => store.feedback.notifications);
  const [displayed, setDisplayed] = useState<any[]>([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  return (
    <>
      {notifications &&
        notifications.length > 0 &&
        notifications.map((notification: any) => {
          const options = {
            key: notification.key,
            variant: notification.variant,
            onClick: () => {
              closeSnackbar(notification.key);
            },
          };
          setTimeout(() => {
            // If notification already displayed, abort
            if (displayed.filter((key: string) => key === notification.key).length > 0) {
              return;
            } else {
              // Display notification using Snackbar
              if (notification.variant === 'error') {
                enqueueSnackbar(notification.message, {
                  ...options,
                  persist: true,
                });
                // Add notification's key to the local state
              } else {
                enqueueSnackbar(notification.message, { ...options });
              }
              setDisplayed([...displayed, notification.key]);
              // Dispatch action to remove the notification from the redux store
              dispatch(removeNotification(notification.key));
            }
          }, 300);
        })}
    </>
  );
};

export default Notifier;
