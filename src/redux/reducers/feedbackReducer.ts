import { FeedbackMessageType } from '../../types/feedback.types';
import { AuthActions, LOGIN_FAILURE, LOGIN_SUCCESS, REFRESH_TOKEN_FAILURE } from '../actions/authActions';
import { CLEAR_FEEDBACK, FeedbackActions } from '../actions/feedbackActions';
import { ORCID_REQUEST_FAILURE, ORCID_SIGNIN_FAILURE, OrcidActions } from '../actions/orcidActions';
import { ResourceActions, SEARCH_FAILURE } from '../actions/resourceActions';
import { SET_USER_FAILURE, UserActions } from '../actions/userActions';

export const feedbackReducer = (
  state: FeedbackMessageType[] = [],
  action: AuthActions | OrcidActions | UserActions | FeedbackActions | ResourceActions
) => {
  let remainingFeedbackMessages = [];
  switch (action.type) {
    case LOGIN_FAILURE:
    case ORCID_SIGNIN_FAILURE:
    case ORCID_REQUEST_FAILURE:
    case REFRESH_TOKEN_FAILURE:
    case SET_USER_FAILURE:
    case SEARCH_FAILURE:
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
