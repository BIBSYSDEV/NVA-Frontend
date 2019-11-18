import { Dispatch } from 'redux';

import { loginFailure, loginSuccess, logoutSuccess } from '../redux/actions/authActions';

export const hubListener = (data: any, dispatch: Dispatch<any>) => {
  switch (data.payload.event) {
    case 'signIn':
      dispatch(loginSuccess());
      break;
    case 'signOut':
      dispatch(logoutSuccess());
      break;
    case 'signIn_failure':
      dispatch(loginFailure('error.login'));
      break;
  }
};
