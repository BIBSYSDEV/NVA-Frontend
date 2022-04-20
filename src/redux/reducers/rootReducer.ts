import { Notification } from '../../types/notification.types';
import { User } from '../../types/user.types';
import { ResourceType } from '../resourcesSlice';

export interface RootStore {
  notification: Notification | null;
  user: User | null;
  resources: { [id: string]: ResourceType };
}
