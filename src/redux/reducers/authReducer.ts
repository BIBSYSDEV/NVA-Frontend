import { AuthActions, LOGIN_SUCCESS, LOGOUT_SUCCESS } from '../actions/authActions';
import { SET_USER_SUCCESS, UserActions } from '../actions/userActions';

export const authReducer = (
  state: { isLoggedIn: boolean } = { isLoggedIn: false },
  action: AuthActions | UserActions
) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
    case SET_USER_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        isLoggedIn: false,
      };
    default:
      return state;
  }
};
