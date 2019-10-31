import { AuthActions, LOGIN_FAILURE, LOGIN_SUCCESS, REFRESH_TOKEN_FAILURE } from '../actions/authActions';
import { CLEAR_FEEDBACK, FeedbackActions } from '../actions/feedbackActions';
import { ORCID_REQUEST_FAILURE, ORCID_SIGNIN_FAILURE, OrcidActions } from '../actions/orcidActions';
import { SET_USER_FAILURE, UserActions } from '../actions/userActions';
import { FeedbackMessageType } from '../types/feedback.types';

export const feedbackReducer = (
  state: FeedbackMessageType[] = [],
  action: AuthActions | OrcidActions | UserActions | FeedbackActions
) => {
  let remainingFeedbackMessages = [];
  switch (action.type) {
    case LOGIN_FAILURE:
    case ORCID_SIGNIN_FAILURE:
    case ORCID_REQUEST_FAILURE:
    case REFRESH_TOKEN_FAILURE:
    case SET_USER_FAILURE:
      return [...state, action];
    case LOGIN_SUCCESS:
      remainingFeedbackMessages = [...state].filter(error => error.message !== LOGIN_FAILURE);
      return [...remainingFeedbackMessages, action];
    case CLEAR_FEEDBACK:
      return [];
    default:
      return state;
  }
};
