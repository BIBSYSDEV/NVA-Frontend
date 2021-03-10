import { Registration } from '../registration.types';

export interface MessageItem {
  date: string;
  id: string;
  identifier: string;
  isDoiRequestRelated: boolean;
  owner: string;
  sender: string;
  text: string;
}

export interface Message {
  messages: MessageItem[];
  publication: Registration;
}
