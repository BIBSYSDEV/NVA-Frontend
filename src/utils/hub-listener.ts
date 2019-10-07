import { Dispatch } from 'redux';

import { loginFailureAction } from '../actions/errorActions';
import { loginSuccessAction, logoutSuccessAction } from '../actions/userActions';
import { getCurrentAuthenticatedUser } from '../api/user';

export const hubListener = (data: any, dispatch: Dispatch<any>) => {
  switch (data.payload.event) {
    case 'signIn':
      dispatch(loginSuccessAction());
      dispatch(getCurrentAuthenticatedUser());
      break;
    case 'signOut':
      dispatch(logoutSuccessAction());
      break;
    case 'signIn_failure':
      dispatch(loginFailureAction('Login failed. Please try again.'));
      break;
  }
};
