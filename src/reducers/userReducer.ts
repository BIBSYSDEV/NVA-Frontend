import { UserActions, SET_USER } from '../actions/userActions';

export const userReducer = (state: any = { user: { firstName: '', lastName: '' } }, action: UserActions) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state.user,
        user: action.user,
      };
    default:
      return state;
  }
};
