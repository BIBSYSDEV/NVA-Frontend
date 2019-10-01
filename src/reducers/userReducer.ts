import { UserActions, SET_USER } from '../actions/userActions';
import User from '../types/user.types';

const initialState: User = {
  name: '',
  email: '',
  id: '',
  institution: '',
  issuer: '',
};

export const userReducer = (state: User = initialState, action: UserActions) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        ...action.user,
      };
    default:
      return state;
  }
};
