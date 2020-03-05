import { Auth } from 'aws-amplify';
import { Dispatch } from 'redux';

import { loginSuccess, logoutSuccess } from '../redux/actions/authActions';
import i18n from '../translations/i18n';
import { setNotification } from '../redux/actions/notificationActions';
import { NotificationVariant } from '../types/notification.types';

export const hubListener = async (data: any, dispatch: Dispatch<any>) => {
  switch (data.payload.event) {
    case 'signIn':
      dispatch(loginSuccess());
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
