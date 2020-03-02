import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

import { removeNotification } from '../redux/actions/notificationActions';
import { RootStore } from '../redux/reducers/rootReducer';
import { NotificationVariant } from '../types/notification.types';
import { Fade } from '@material-ui/core';

const autoHideDuration = {
  [NotificationVariant.Error]: null,
  [NotificationVariant.Info]: 6000,
  [NotificationVariant.Success]: 6000,
  [NotificationVariant.Warning]: null,
};

const Notifier: React.FC = () => {
  const notification = useSelector((store: RootStore) => store.notification);
  const dispatch = useDispatch();

  const handleClose = (_?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(removeNotification());
  };

  return notification ? (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={true}
      autoHideDuration={autoHideDuration[notification.variant]}
      onClose={handleClose}
      TransitionComponent={Fade}
      transitionDuration={100}>
      <Alert onClose={handleClose} variant="filled" severity={notification.variant}>
        {notification.message}
      </Alert>
    </Snackbar>
  ) : null;
};

export default Notifier;
