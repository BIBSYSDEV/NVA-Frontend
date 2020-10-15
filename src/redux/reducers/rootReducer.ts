import { combineReducers } from 'redux';
import { Notification } from '../../types/notification.types';
import { User } from '../../types/user.types';
import { InstitutionUnitBase } from '../../types/institution.types';
import { notificationReducer } from './notificationReducer';
import { userReducer } from './userReducer';
import { institutionReducer } from './institutionReducer';

export interface RootStore {
  institutions: InstitutionUnitBase[];
  notification: Notification;
  user: User;
}

export default combineReducers({
  institutions: institutionReducer,
  notification: notificationReducer,
  user: userReducer,
});
