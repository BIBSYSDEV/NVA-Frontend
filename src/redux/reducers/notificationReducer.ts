import uuid from 'uuid';

import i18n from '../../translations/i18n';
import { Notification } from '../../types/notification.types';
import { AuthActions, LOGIN_FAILURE, REFRESH_TOKEN_FAILURE } from '../actions/authActions';
import {
  ADD_NOTIFICATION,
  CLEAR_NOTIFICATIONS,
  NotificationActions,
  REMOVE_NOTIFICATION,
} from '../actions/notificationActions';
import { ORCID_REQUEST_FAILURE, ORCID_SIGNIN_FAILURE, OrcidActions } from '../actions/orcidActions';
import {
  CREATE_PUBLICATION_FAILURE,
  CREATE_PUBLICATION_SUCCESS,
  GET_PUBLICATION_FAILURE,
  UPDATE_PUBLICATION_FAILURE,
  UPDATE_PUBLICATION_SUCCESS,
  PublicationActions,
} from '../actions/publicationActions';
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
    | PublicationActions
) => {
  switch (action.type) {
    case ORCID_SIGNIN_FAILURE:
    case ORCID_REQUEST_FAILURE:
    case REFRESH_TOKEN_FAILURE:
    case SET_USER_FAILURE:
    case SEARCH_FAILURE:
    case CREATE_PUBLICATION_FAILURE:
    case CREATE_PUBLICATION_SUCCESS:
    case UPDATE_PUBLICATION_FAILURE:
    case UPDATE_PUBLICATION_SUCCESS:
    case GET_PUBLICATION_FAILURE:
    case LOGIN_FAILURE:
      return [...state, { key: uuid.v4(), ...action }];
    case ADD_NOTIFICATION:
      return [...state, { key: uuid.v4(), ...action.notification }];
    case REMOVE_NOTIFICATION:
      return state.filter(notification => notification.key !== action.key);
    case SET_USER_SUCCESS:
      return dismissNotification(state, 'feedback:error.get_user');
    case CLEAR_NOTIFICATIONS:
      return [];
    default:
      return state;
  }
};

const dismissNotification = (state: Notification[], translationKey: string): Notification[] => {
  const itemToKeep = state.find(notification => notification.message === i18n.t(translationKey));
  if (itemToKeep) {
    const filteredNotifications = state.filter(notification => notification.message !== itemToKeep.message);
    return [...filteredNotifications, { ...itemToKeep, dismissed: true }];
  } else {
    return state;
  }
};
