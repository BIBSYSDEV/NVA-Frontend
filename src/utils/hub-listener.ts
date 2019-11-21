import { Dispatch } from 'redux';

import { loginFailure, loginSuccess, logoutSuccess } from '../redux/actions/authActions';
import i18n from '../translations/i18n';

export const hubListener = (data: any, dispatch: Dispatch<any>) => {
  switch (data.payload.event) {
    case 'signIn':
      dispatch(loginSuccess());
      break;
    case 'signOut':
      dispatch(logoutSuccess());
      break;
    case 'signIn_failure':
      dispatch(loginFailure(i18n.t('feedback:error.login')));
      break;
  }
};
