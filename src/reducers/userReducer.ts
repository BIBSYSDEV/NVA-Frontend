import { Auth } from 'aws-amplify';

import { LOG_IN, LOG_OUT, SET_USER, UserActions } from '../actions/userActions';
import User, { emptyUser } from '../types/user.types';

export const userReducer = (state: User = emptyUser, action: UserActions) => {
  switch (action.type) {
    case LOG_IN:
      Auth.federatedSignIn();
      return state;
    case LOG_OUT:
      Auth.signOut();
      return state;
    case SET_USER:
      return {
        ...state,
        ...action.user,
      };
    default:
      return state;
  }
};
