import {
  ErrorActions,
  LOGIN_FAILURE,
  ORCID_REQUEST_FAILURE,
  ORCID_SIGNIN_FAILURE,
  REFRESH_TOKEN_FAILURE,
} from '../actions/errorActions';
import { LOGIN_SUCCESS, UserActions } from '../actions/userActions';
import { FeedbackMessageType } from '../types/feedback.types';

export const feedbackReducer = (state: FeedbackMessageType[] = [], action: ErrorActions | UserActions) => {
  switch (action.type) {
    case LOGIN_FAILURE:
    case ORCID_SIGNIN_FAILURE:
    case ORCID_REQUEST_FAILURE:
    case REFRESH_TOKEN_FAILURE:
      return [...state, action];
    case LOGIN_SUCCESS:
      const remainingErrorMessages = [...state].filter(error => {
        return error.message !== LOGIN_FAILURE;
      });
      return [...remainingErrorMessages, action];
    default:
      return state;
  }
};
