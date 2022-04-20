import { combineReducers } from 'redux';
import { Notification } from '../../types/notification.types';
import { User } from '../../types/user.types';
import { notificationReducer } from './notificationReducer';
import { userReducer } from './userReducer';
import { resourcesReducer } from './ResourcesReducer';
import { ResourceType } from '../actions/resourcesActions';

export interface RootStore {
  notification: Notification | null;
  user: User | null;
  resources: { [id: string]: ResourceType };
}

// export const rootReducer = combineReducers({
//   notification: notificationReducer,
//   user: userReducer,
//   resources: resourcesReducer,
// });
