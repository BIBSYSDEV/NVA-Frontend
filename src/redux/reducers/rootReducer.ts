import { combineReducers } from 'redux';
import { Notification } from '../../types/notification.types';
import { User } from '../../types/user.types';
import { InstitutionState } from '../../types/institution.types';
import { notificationReducer } from './notificationReducer';
import { userReducer } from './userReducer';
import { institutionReducer } from './institutionReducer';
import { resourcesReducer } from './ResourcesReducer';
import { ResourceType } from '../actions/resourcesActions';

export interface RootStore {
  institutions: InstitutionState;
  notification: Notification | null;
  user: User | null;
  resources: { [id: string]: ResourceType };
}

export const rootReducer = combineReducers({
  institutions: institutionReducer,
  notification: notificationReducer,
  user: userReducer,
  resources: resourcesReducer,
});
