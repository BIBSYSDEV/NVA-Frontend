import uuid from 'uuid';

import { FeedbackType, initialFeedbackState, NotificationType } from '../../types/feedback.types';
import { AuthActions, LOGIN_FAILURE, LOGIN_SUCCESS, REFRESH_TOKEN_FAILURE } from '../actions/authActions';
import { ADD_NOTIFICATION, FeedbackActions, REMOVE_NOTIFICATION } from '../actions/feedbackActions';
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
  state: FeedbackType = initialFeedbackState,
  action: FeedbackActions | AuthActions | OrcidActions | UserActions | FeedbackActions | SearchActions | ResourceActions
) => {
  switch (action.type) {
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
      return {
        ...state,
        nextNotification: state.nextNotification + 1,
        notifications: [...state.notifications, { key: uuid.v4(), ...action }],
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification: NotificationType) => notification.message !== LOGIN_FAILURE
        ),
      };
    case SET_USER_SUCCESS:
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification: NotificationType) => notification.message !== SET_USER_FAILURE
        ),
      };
    case ADD_NOTIFICATION:
      return {
        ...state,
        nextNotification: state.nextNotification + 1,
        notifications: [...state.notifications, { key: uuid.v4(), ...action.notification }],
      };
    case REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter((notification: any) => notification.key !== action.key),
      };
    default:
      return state;
  }
};
