import { Auth } from 'aws-amplify';
import { Dispatch } from 'redux';

import { logoutSuccess } from '../redux/actions/authActions';
import i18n from '../translations/i18n';
import { setNotification } from '../redux/actions/notificationActions';
import { NotificationVariant } from '../types/notification.types';
import { getCurrentUserAttributes } from '../api/userApi';
import { setUser } from '../redux/actions/userActions';

export const hubListener = async (data: any, dispatch: Dispatch<any>) => {
  switch (data.payload.event) {
    case 'signIn':
      console.log('signIn, getUser', data);
      const currentUser = await getCurrentUserAttributes();
      if (currentUser) {
        if (currentUser.error) {
          dispatch(setNotification(currentUser.error, NotificationVariant.Error));
        } else {
          dispatch(setUser(currentUser));
        }
      }
      break;
    case 'signOut':
      dispatch(logoutSuccess());
      break;
    case 'signIn_failure':
      const cognitoUser = await Auth.currentAuthenticatedUser();
      !cognitoUser && dispatch(setNotification(i18n.t('feedback:error.login', NotificationVariant.Error)));
      break;
  }
};
