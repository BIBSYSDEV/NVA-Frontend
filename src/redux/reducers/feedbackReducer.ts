import { FeedbackMessageType } from '../../types/feedback.types';
import { AuthActions, LOGIN_FAILURE, LOGIN_SUCCESS, REFRESH_TOKEN_FAILURE } from '../actions/authActions';
import { CLEAR_FEEDBACK, FeedbackActions } from '../actions/feedbackActions';
import { ORCID_REQUEST_FAILURE, ORCID_SIGNIN_FAILURE, OrcidActions } from '../actions/orcidActions';
import {
  CREATE_RESOURCE_FAILURE,
  CREATE_RESOURCE_SUCCESS,
  GET_RESOURCE_FAILURE,
  ResourceActions,
  UPDATE_RESOURCE_FAILURE,
  UPDATE_RESOURCE_SUCCESS,
} from '../actions/resourceActions';
import { SEARCH_FAILURE, SearchActions } from '../actions/searchActions';
import { SET_USER_FAILURE, SET_USER_SUCCESS, UserActions } from '../actions/userActions';

export const feedbackReducer = (
  state: FeedbackMessageType[] = [],
  action: AuthActions | OrcidActions | UserActions | FeedbackActions | SearchActions | ResourceActions
) => {
  let remainingFeedbackMessages = [];
  switch (action.type) {
    case LOGIN_FAILURE:
    case ORCID_SIGNIN_FAILURE:
    case ORCID_REQUEST_FAILURE:
    case REFRESH_TOKEN_FAILURE:
    case SET_USER_FAILURE:
    case SEARCH_FAILURE:
    case CREATE_RESOURCE_FAILURE:
    case CREATE_RESOURCE_SUCCESS:
    case UPDATE_RESOURCE_FAILURE:
    case UPDATE_RESOURCE_SUCCESS:
    case GET_RESOURCE_FAILURE:
      return [...state, action];
    case LOGIN_SUCCESS:
      remainingFeedbackMessages = [...state].filter(error => error.message !== LOGIN_FAILURE);
      return [...remainingFeedbackMessages, action];
    case SET_USER_SUCCESS:
      remainingFeedbackMessages = state.filter(error => error.message !== SET_USER_FAILURE);
      return [...remainingFeedbackMessages];
    case CLEAR_FEEDBACK:
      return [];
    default:
      return state;
  }
};
