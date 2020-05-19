import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

import { removeNotification } from '../redux/actions/notificationActions';
import { RootStore } from '../redux/reducers/rootReducer';
import { NotificationVariant } from '../types/notification.types';
import { Fade } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

const autoHideDuration = {
  [NotificationVariant.Error]: 6000,
  [NotificationVariant.Info]: 3000,
  [NotificationVariant.Success]: 3000,
  [NotificationVariant.Warning]: 6000,
};

const Notifier: React.FC = () => {
  const notification = useSelector((store: RootStore) => store.notification);
  const dispatch = useDispatch();
  const history = useHistory();

  const notificationRef = useRef(notification);
  useEffect(() => {
    notificationRef.current = notification;
  }, [notification]);

  useEffect(() => {
    // Remove snackbar when navigating to a different page
    if (notificationRef.current) {
      dispatch(removeNotification());
    }
  }, [dispatch, history.location.pathname]);

  const handleClose = (_?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(removeNotification());
  };

  return notification ? (
    <Snackbar
      data-testid="snackbar"
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
