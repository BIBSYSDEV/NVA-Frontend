import React, { FC, SyntheticEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Fade, Snackbar, SnackbarCloseReason } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { removeNotification } from '../redux/actions/notificationActions';
import { RootStore } from '../redux/reducers/rootReducer';
import { autoHideNotificationDuration } from '../utils/constants';

const Notifier: FC = () => {
  const notification = useSelector((store: RootStore) => store.notification);
  const dispatch = useDispatch();

  const handleClose = (_: SyntheticEvent, reason?: SnackbarCloseReason) => {
    if (reason !== 'clickaway') {
      dispatch(removeNotification());
    }
  };

  return notification ? (
    <Snackbar
      data-testid={`snackbar-${notification.variant}`}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={true}
      autoHideDuration={autoHideNotificationDuration[notification.variant]}
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
