import { Notification } from '../../types/notification.types';
import { User } from '../../types/user.types';
import { ResourceType } from '../actions/resourcesActions';

export interface RootStore {
  notification: Notification | null;
  user: User | null;
  resources: { [id: string]: ResourceType };
}
