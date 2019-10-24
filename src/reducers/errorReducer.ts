import {
  ErrorActions,
  LOGIN_FAILURE,
  ORCID_REQUEST_ERROR,
  ORCID_SIGNIN_ERROR,
  REFRESH_TOKEN_FAILURE,
} from '../actions/errorActions';
import { LOGIN_SUCCESS, LOGOUT_SUCCESS, REFRESH_TOKEN_SUCCESS, SET_USER, UserActions } from '../actions/userActions';

export const errorReducer = (state: string | null = null, action: ErrorActions | UserActions) => {
  switch (action.type) {
    case LOGIN_FAILURE:
    case ORCID_SIGNIN_ERROR:
    case ORCID_REQUEST_ERROR:
    case REFRESH_TOKEN_FAILURE:
      return action.message;
    case LOGIN_SUCCESS:
    case SET_USER:
    case LOGOUT_SUCCESS:
    case REFRESH_TOKEN_SUCCESS:
      return null;
    default:
      return state;
  }
};
