import { Dispatch } from 'redux';

import { loginFailureAction, loginSuccessAction, logoutSuccessAction } from '../actions/authActions';

export const hubListener = (data: any, dispatch: Dispatch<any>) => {
  switch (data.payload.event) {
    case 'signIn':
      dispatch(loginSuccessAction());
      break;
    case 'signOut':
      dispatch(logoutSuccessAction());
      break;
    case 'signIn_failure':
      dispatch(loginFailureAction('Login failed. Please try again.'));
      break;
  }
};
