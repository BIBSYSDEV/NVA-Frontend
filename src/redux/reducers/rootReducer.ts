import { combineReducers } from 'redux';
import { Notification } from '../../types/notification.types';
import { User } from '../../types/user.types';
import { InstitutionState } from '../../types/institution.types';
import { notificationReducer } from './notificationReducer';
import { userReducer } from './userReducer';
import { institutionReducer } from './institutionReducer';
import { Journal, Publisher } from '../../types/registration.types';
import { publicationChannelReducer } from './publicationChannelReducer';

export interface RootStore {
  institutions: InstitutionState;
  notification: Notification | null;
  user: User | null;
  publicationChannel: { [id: string]: Publisher | Journal };
}

export const rootReducer = combineReducers({
  institutions: institutionReducer,
  notification: notificationReducer,
  user: userReducer,
  publicationChannel: publicationChannelReducer,
});
