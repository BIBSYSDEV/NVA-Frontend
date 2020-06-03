import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { Fade } from '@material-ui/core';
import { useLocation } from 'react-router-dom';

import { removeNotification } from '../redux/actions/notificationActions';
import { RootStore } from '../redux/reducers/rootReducer';
import { autoHideNotificationDuration } from '../utils/constants';

const Notifier: React.FC = () => {
  const notification = useSelector((store: RootStore) => store.notification);
  const dispatch = useDispatch();
  const location = useLocation();

  const notificationRef = useRef(notification);
  useEffect(() => {
    notificationRef.current = notification;
  }, [notification]);

  useEffect(() => {
    // Remove snackbar when navigating to a different page
    if (notificationRef.current) {
      dispatch(removeNotification());
    }
  }, [dispatch, location.pathname]);

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
