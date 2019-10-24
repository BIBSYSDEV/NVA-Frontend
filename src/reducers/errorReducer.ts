import {
  ErrorActions,
  LOGIN_FAILURE,
  ORCID_REQUEST_FAILURE,
  ORCID_SIGNIN_FAILURE,
  REFRESH_TOKEN_FAILURE,
} from '../actions/errorActions';
import { UserActions } from '../actions/userActions';
import { ErrorMessageType } from '../types/error.types';

export const errorReducer = (state: ErrorMessageType[] = [], action: ErrorActions | UserActions) => {
  switch (action.type) {
    case LOGIN_FAILURE:
    case ORCID_SIGNIN_FAILURE:
    case ORCID_REQUEST_FAILURE:
    case REFRESH_TOKEN_FAILURE:
      return [...state, action];
    default:
      return state;
  }
};
