import uuid from 'uuid';

import i18n from '../../translations/i18n';
import { Notification } from '../../types/feedback.types';
import { AuthActions, LOGIN_FAILURE, REFRESH_TOKEN_FAILURE } from '../actions/authActions';
import {
    ADD_NOTIFICATION, CLEAR_NOTIFICATIONS, NotificationActions, REMOVE_NOTIFICATION
} from '../actions/notificationActions';
import { ORCID_REQUEST_FAILURE, ORCID_SIGNIN_FAILURE, OrcidActions } from '../actions/orcidActions';
import {
    CREATE_RESOURCE_FAILURE, CREATE_RESOURCE_SUCCESS, GET_RESOURCE_FAILURE, ResourceActions,
    UPDATE_RESOURCE_FAILURE, UPDATE_RESOURCE_SUCCESS
} from '../actions/resourceActions';
import { SEARCH_FAILURE, SearchActions } from '../actions/searchActions';
import { SET_USER_FAILURE, SET_USER_SUCCESS, UserActions } from '../actions/userActions';

export const notificationReducer = (
  state: Notification[] = [],
  action:
    | NotificationActions
    | AuthActions
    | OrcidActions
    | UserActions
    | NotificationActions
    | SearchActions
    | ResourceActions
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
    case LOGIN_FAILURE:
      return [...state, { key: uuid.v4(), ...action }];
    case ADD_NOTIFICATION:
      return [...state, { key: uuid.v4(), ...action.notification }];
    case REMOVE_NOTIFICATION:
      return state.filter(notification => notification.key !== action.key);
    case SET_USER_SUCCESS:
      const itemToKeep = state.find(notification => notification.message === i18n.t('feedback:error.get_user'));
      if (itemToKeep) {
        const filtered = state.filter(notification => notification.message !== i18n.t('feedback:error.get_user'));
        return [...filtered, { ...itemToKeep, dismissed: true }];
      } else {
        return state;
      }
    case CLEAR_NOTIFICATIONS:
      return [];
    default:
      return state;
  }
};
