import { Alert, Box, Fade, Snackbar, SnackbarCloseReason, Typography } from '@mui/material';
import { SyntheticEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeNotification } from '../redux/notificationSlice';
import { RootState } from '../redux/store';

const autoHideNotificationDuration = {
  error: 9000,
  info: 6000,
  success: 3000,
  warning: 6000,
};

export const Notifier = () => {
  const notification = useSelector((store: RootState) => store.notification);
  const dispatch = useDispatch();

  const handleClose = (_: Event | SyntheticEvent, reason?: SnackbarCloseReason) => {
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
        <Typography sx={{ display: 'flex', flexDirection: 'column', color: 'white', maxWidth: '25rem' }}>
          {notification.message}
          {notification.detail && <span>{notification.detail}</span>}
        </Typography>
      </Alert>
    </Snackbar>
  ) : null;
};
