import { UserActions, SET_USER } from '../actions/userActions';

const initialState = {
  firstName: '',
  lastName: '',
};

export const userReducer = (state: any = initialState, action: UserActions) => {
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
