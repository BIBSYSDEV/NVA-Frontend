import { combineReducers } from 'redux';
import { Notification } from '../../types/notification.types';
import { User } from '../../types/user.types';
import { InstitutionState } from '../../types/institution.types';
import { notificationReducer } from './notificationReducer';
import { userReducer } from './userReducer';
import { institutionReducer } from './institutionReducer';
import { Journal, Publisher, Registration } from '../../types/registration.types';
import { resourcesReducer } from './ResourcesReducer';

export interface RootStore {
  institutions: InstitutionState;
  notification: Notification | null;
  user: User | null;
  resources: { [id: string]: Publisher | Journal | Registration };
}

export const rootReducer = combineReducers({
  institutions: institutionReducer,
  notification: notificationReducer,
  user: userReducer,
  resources: resourcesReducer,
});
