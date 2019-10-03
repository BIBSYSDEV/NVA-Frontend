import { Auth } from 'aws-amplify';

import { LOG_IN, LOG_OUT, SET_USER, UserActions } from '../actions/userActions';
import User from '../types/user.types';
import { getUserDataFromCognitoUser } from '../utils/getUserDataFromCognitoUser';

const initialState: User = {
  name: '',
  email: '',
};

export const userReducer = (state: User = initialState, action: UserActions) => {
  switch (action.type) {
    case LOG_IN:
      Auth.federatedSignIn();
      return state;
    case LOG_OUT:
      Auth.signOut();
      return state;
    case SET_USER:
      const decodedUserData = getUserDataFromCognitoUser(action.user);
      return {
        ...state,
        ...decodedUserData,
      };
    default:
      return state;
  }
};
